// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { AuthMiddleware } from "../_shared/jwt/default.ts";

console.log("🚀 delete-user function loaded");

Deno.serve((req) =>
    AuthMiddleware(req, async (req) => {
        console.log("📍 Inside delete-user handler");

        try {
            const authHeader = req.headers.get("Authorization");
            const supabaseUrl = Deno.env.get("SUPABASE_URL");
            const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

            if (!supabaseUrl || !supabaseServiceKey) {
                console.error("❌ Missing environment variables");
                return new Response(JSON.stringify({ error: "Server configuration error" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

            // ユーザー特定用のクライアント
            const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
                global: { headers: { Authorization: authHeader! } },
            });

            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

            if (authError || !user) {
                console.error("❌ Auth failed:", authError?.message);
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                });
            }

            console.log("✅ User authenticated:", user.id);

            // Admin クライアント（削除実行用）
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
                auth: { autoRefreshToken: false, persistSession: false },
            });

            // TODO: groups (owner_user_id) が一致するグループが消えるので、今後仕様を含めた実装方法の検討をすべき
            console.log("🗑️ Deleting user from auth.users (Cascade will handle DB cleanup)...");
            
            const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

            if (deleteError) {
                console.error(`❌ Delete failed for user ${user.id}:`, deleteError.message);
                return new Response(JSON.stringify({ error: "Failed to delete user", details: deleteError.message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

            console.log(`✅ Successfully deleted user and all related data: ${user.id}`);

            return new Response(
                JSON.stringify({ success: true, message: "Account and data successfully deleted" }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );

        } catch (err) {
            console.error("❌ Unexpected error:", err);
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }),
);