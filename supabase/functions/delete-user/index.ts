// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AuthMiddleware } from "../_shared/jwt/default.ts";

console.log("🚀 delete-user function loaded");


Deno.serve((req) =>
	AuthMiddleware(req, async (req) => {
		console.log("📍 Inside delete-user handler");

		try {
			const authHeader = req.headers.get("Authorization");

			console.log("🔑 Creating Supabase client...");

			const supabaseUrl = Deno.env.get("SUPABASE_URL");
			const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
			const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

			if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
				console.error("❌ Missing environment variables");
				return new Response(
					JSON.stringify({ error: "Server configuration error" }),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}

			const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
				global: { headers: { Authorization: authHeader! } },
			});

			console.log("👤 Getting user...");
			const {
				data: { user },
				error: authError,
			} = await supabaseClient.auth.getUser();

			if (authError || !user) {
				console.error("❌ Auth failed:", authError?.message);
				return new Response(JSON.stringify({ error: "Unauthorized" }), {
					status: 401,
					headers: { "Content-Type": "application/json" },
				});
			}

			console.log("✅ User authenticated:", user.id);

			// Admin クライアント（RLS をバイパス）
			const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			});

			console.log("🗑️ Starting cascading deletion process...");

			// ====================================
			// 1. items テーブル: created_by_user_id と bought_by_user_id を null に
			// ====================================
			console.log("📦 Updating items table...");

			const { error: itemsCreatedError } = await supabaseAdmin
				.from("items")
				.update({ created_by_user_id: null })
				.eq("created_by_user_id", user.id);

			if (itemsCreatedError) {
				console.error(
					"❌ Failed to update items.created_by_user_id:",
					itemsCreatedError,
				);
				return new Response(
					JSON.stringify({
						error: "Failed to update items",
						details: itemsCreatedError.message,
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
			console.log("✅ items.created_by_user_id set to null");

			const { error: itemsBoughtError } = await supabaseAdmin
				.from("items")
				.update({ bought_by_user_id: null })
				.eq("bought_by_user_id", user.id);

			if (itemsBoughtError) {
				console.error(
					"❌ Failed to update items.bought_by_user_id:",
					itemsBoughtError,
				);
				return new Response(
					JSON.stringify({
						error: "Failed to update items",
						details: itemsBoughtError.message,
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
			console.log("✅ items.bought_by_user_id set to null");

			// ====================================
			// 2. group_members テーブル: user_id のデータを削除
			// ====================================
			console.log("👥 Deleting from group_members table...");

			const { error: groupMembersError } = await supabaseAdmin
				.from("group_members")
				.delete()
				.eq("user_id", user.id);

			if (groupMembersError) {
				console.error("❌ Failed to delete group_members:", groupMembersError);
				return new Response(
					JSON.stringify({
						error: "Failed to delete group members",
						details: groupMembersError.message,
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
			console.log("✅ group_members deleted");

			// ====================================
			// 3. groups テーブル: owner_user_id のデータを削除
			// TODO: グループに他のメンバーがいる場合の対応検討(現在はownerが退会するとそのグループも消えてしまう)
			// ====================================
			console.log("🏢 Deleting from groups table...");

			const { error: groupsError } = await supabaseAdmin
				.from("groups")
				.delete()
				.eq("owner_user_id", user.id);

			if (groupsError) {
				console.error("❌ Failed to delete groups:", groupsError);
				return new Response(
					JSON.stringify({
						error: "Failed to delete groups",
						details: groupsError.message,
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}
			console.log("✅ groups deleted");

			// ====================================
			// 4. auth.users からユーザーを削除
			// ====================================
			console.log("🗑️ Deleting user from auth...");
			const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
				user.id,
			);

			if (deleteError) {
				console.error(
					`❌ Delete failed for user ${user.id}:`,
					deleteError.message,
				);
				return new Response(
					JSON.stringify({
						error: "Failed to delete user",
						details: deleteError.message,
					}),
					{ status: 500, headers: { "Content-Type": "application/json" } },
				);
			}

			console.log(`✅ Successfully deleted user: ${user.id}`);

			return new Response(
				JSON.stringify({
					success: true,
					message: "User and related data successfully deleted",
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json" },
				},
			);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			const errorStack = err instanceof Error ? err.stack : undefined;

			console.error("❌ Unexpected error:", {
				message: errorMessage,
				stack: errorStack,
			});

			return new Response(
				JSON.stringify({
					error: "Internal Server Error",
					details: errorMessage,
				}),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			);
		}
	}),
);
