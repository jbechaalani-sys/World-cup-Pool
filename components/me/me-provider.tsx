"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  dismissPicker,
  readStore,
  setMe as persistMe,
} from "@/lib/me-storage";

interface MeContextValue {
  me: string | null;
  ready: boolean;
  pickerDismissed: boolean;
  choose: (name: string | null) => void;
  dismiss: () => void;
}

const MeContext = createContext<MeContextValue>({
  me: null,
  ready: false,
  pickerDismissed: false,
  choose: () => {},
  dismiss: () => {},
});

export function useMe() {
  return useContext(MeContext);
}

export function MeProvider({ children }: { children: ReactNode }) {
  const [me, setMeState] = useState<string | null>(null);
  const [pickerDismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const store = readStore();
    setMeState(store.meName);
    setDismissed(store.pickerDismissed);
    setReady(true);
  }, []);

  const choose = useCallback((name: string | null) => {
    persistMe(name);
    setMeState(name);
    setDismissed(true);
  }, []);

  const dismiss = useCallback(() => {
    dismissPicker();
    setDismissed(true);
  }, []);

  return (
    <MeContext.Provider value={{ me, ready, pickerDismissed, choose, dismiss }}>
      {children}
    </MeContext.Provider>
  );
}
