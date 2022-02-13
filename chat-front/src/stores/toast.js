import { writable } from "svelte/store";

const toastType = ['success', 'info', 'warning', 'error'];

export const toastStore = writable({
    index: 1,
    toastList: [],
    duraction: 3000,
});

export const setDuraction = (duraction) => {
    toastStore.update((state) => ({...state, duraction: duraction}))
}

export const deleteToast = (index) => {
    toastStore.update((state) => ({
        ...state,
        toastList: state.toastList.filter((item) => item.index !== index)
    }));
}

export const insertToast = (type, message = 'blanck')  => {
    if (toastType.includes(type)) {
        toastStore.update((state) => ({
            ...state,
            index: state.index + 1,
            toastList: [...state.toastList, { index: state.index + 1, type: type, message: message, isOn: true }],
        }))
    }
}
