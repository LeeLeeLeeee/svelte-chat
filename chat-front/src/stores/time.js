import { readable } from 'svelte/store';
const MILLISECOND = 1;
const SECOND = MILLISECOND * 1000;

const convertTimeFormat = (time) => {
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
    })
    return formatter.format(time);
}

export const time = readable(convertTimeFormat(new Date()), (set) => {
    const interval = setInterval(() => {
        set(convertTimeFormat(new Date()));
    }, SECOND)

    return function stop() {
		clearInterval(interval);
	};
})

