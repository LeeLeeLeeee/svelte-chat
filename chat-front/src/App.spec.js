import { render, screen } from '@testing-library/svelte';
import App from './pages';

test("says 'hello world!'", () => {
    render(App);
    const node = screen.queryByText("Hello world!");
    expect(node).not.toBeNull();
})