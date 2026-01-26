import { Redirect } from "expo-router";

export default function GroupIndex() {
	return <Redirect href="/(protected)/(group)/register" />;
}
