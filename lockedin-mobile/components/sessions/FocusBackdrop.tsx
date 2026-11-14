import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import type { FocusBackdrop as FocusBackdropVariant } from "@/lib/theme";

function Orb({
  color,
  style,
  paused,
}: {
  color: string;
  style: object;
  paused: boolean;
}) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (paused) return;
    t.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [paused, t]);

  const animated = useAnimatedStyle(() => ({
    transform: [
      { translateX: (t.value - 0.5) * 28 },
      { translateY: (0.5 - t.value) * 22 },
      { scale: 0.92 + t.value * 0.18 },
    ],
  }));

  return (
    <Animated.View
      style={[styles.orb, { backgroundColor: color }, style, animated]}
    />
  );
}

export function FocusBackdrop({
  variant,
  paused = false,
}: {
  variant: FocusBackdropVariant;
  paused?: boolean;
}) {
  if (variant === "solid") {
    return <View style={[StyleSheet.absoluteFill, styles.solid]} />;
  }

  if (variant === "pattern") {
    return (
      <View style={[StyleSheet.absoluteFill, styles.patternBase]}>
        {Array.from({ length: 48 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                left: (index % 8) * 22 + 6,
                top: Math.floor(index / 8) * 22 + 6,
              },
            ]}
          />
        ))}
        <View style={styles.patternVignette} />
      </View>
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.gradientBase]}>
      <Orb color="#fb7185" paused={paused} style={styles.orbA} />
      <Orb color="#60a5fa" paused={paused} style={styles.orbB} />
      <Orb color="#34d399" paused={paused} style={styles.orbC} />
      <Orb color="#fbbf24" paused={paused} style={styles.orbD} />
    </View>
  );
}

const styles = StyleSheet.create({
  solid: {
    backgroundColor: "#141414",
  },
  gradientBase: {
    backgroundColor: "#0e0e12",
    overflow: "hidden",
  },
  patternBase: {
    backgroundColor: "#101014",
    overflow: "hidden",
  },
  patternVignette: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(16,16,20,0.55)",
  },
  dot: {
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.85,
  },
  orbA: { width: 180, height: 220, top: -40, left: -30 },
  orbB: { width: 200, height: 240, right: -50, bottom: -60 },
  orbC: { width: 140, height: 160, top: 80, left: 90 },
  orbD: { width: 120, height: 140, bottom: 20, left: 20 },
});
