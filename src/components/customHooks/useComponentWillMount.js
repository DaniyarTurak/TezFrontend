import { useMemo } from "react";

export default function useComponentWillMount(func) {
  useMemo(func, []);
}
