import { MD3LightTheme } from "react-native-paper";

export const paperTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,

		primary: "#EE7800",
		onPrimary: "#FFFFFF",
		primaryContainer: "#FFD7B0",
		onPrimaryContainer: "#3A1B00",

		secondary: "#EE7800",
		onSecondary: "#FFFFFF",
		secondaryContainer: "#FFE1C4", // ← 選択時の背景色（今の紫の部分）
		onSecondaryContainer: "#3A1B00",

		background: "#FEFEFE",
		surface: "#FEFEFE",
		onSurface: "#1A1A1A",

		surfaceVariant: "#E3E3E3",
		onSurfaceVariant: "#6B6B6B",
		outline: "#E3E3E3",

		surfaceDisabled: "rgba(227,227,227,0.4)",
		onSurfaceDisabled: "rgba(26,26,26,0.38)",
	},
};
