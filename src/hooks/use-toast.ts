
import { useState, useEffect } from 'react';
import { 
  ToastActionElement, 
  ToastProps 
} from '@/components/ui/toast';

export type ToastType = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toasts: ToastType[] = [];

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToastType;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToastType>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: string;
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: string;
    };

interface State {
  toasts: ToastType[];
}

let listeners: ((state: State) => void)[] = [];

let memoryState: State = { toasts };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) =>
            t.id === toastId || toastId === undefined
              ? {
                  ...t,
                  open: false,
                }
              : t
          ),
        };
      }
      
      return {
        ...state,
        toasts: state.toasts.map((t) => ({
          ...t,
          open: false,
        })),
      };
    }
    
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
}

function add(toast: Omit<ToastType, 'id' | 'open' | 'onOpenChange'>) {
  const id = genId();

  const newToast = {
    ...toast,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss(id);
    },
  };

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: newToast,
  });

  return id;
}

function update(toast: ToastType) {
  dispatch({
    type: actionTypes.UPDATE_TOAST,
    toast,
  });
}

function dismiss(toastId?: string) {
  dispatch({
    type: actionTypes.DISMISS_TOAST,
    toastId,
  });
}

function remove(toastId?: string) {
  dispatch({
    type: actionTypes.REMOVE_TOAST,
    toastId,
  });
}

function useToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast: {
      ...state,
      add,
      update,
      dismiss,
      remove,
    },
  };
}

export { useToast, add as toast };
