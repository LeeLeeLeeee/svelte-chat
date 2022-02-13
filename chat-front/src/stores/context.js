import { writable } from 'svelte/store';

export const contextStore = writable({
	isOpen: false,
    target: '',
	x: 0,
    y: 0,
	props: {},
});

export const setContextProps = (props) => {
	contextStore.update((state) => ({...state, props}))
}

export const setContextTarget = (contextId) => {
	contextStore.update((state) => ({...state, isOpen: false, target: contextId }));
};

export const setContextOpen = () => {
	contextStore.update((state) => ({ ...state, isOpen: true }));
};

export const setContextClose = () => {
	contextStore.update((state) => ({ ...state, isOpen: false, target: '' }));
};

export const setPosition = ({x, y}) => {
    contextStore.update((state) => ({...state, x, y}));
}
