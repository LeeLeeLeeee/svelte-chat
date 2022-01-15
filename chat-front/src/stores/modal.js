import { writable } from 'svelte/store';

export const modalStore = writable({
	isOpen: false,
	target: ''
});

export const setModalTarget = (modalId) => {
	modalStore.set({ isOpen: false, target: modalId });
};

export const setModalOpen = () => {
	modalStore.update((state) => ({ ...state, isOpen: true }));
};

export const setModalClose = () => {
	modalStore.set({ isOpen: false, target: '' });
};
