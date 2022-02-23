import { render, screen, cleanup } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/svelte/node_modules/@testing-library/dom';
import App from './pages';
import Header from './components/common/Header';
import CreateUserModal from './components/home/modals/CreateUserModal';
import { setModalClose, setModalOpen, setModalTarget } from './stores/modal';
import axios from 'axios';

jest.mock('axios');
describe("case-1 home render", () => {
    beforeAll(() => {
        const response = { status: 200, data: { data: [] }};
        axios.get.mockResolvedValue(response);
    })
    test("case-1-1 home has a create button", () => {
        render(App);
        const createButton = screen.queryByText("계정 생성");
        expect(createButton).not.toBeNull();
    });

    test("case-1-2 home has a drop-down list", () => {
        render(App);
        const dropdown = screen.queryByText("생성된 유저 목록");
        expect(dropdown).not.toBeNull();
    });
    afterEach(() => {
        cleanup()
    })
});

describe("case-2 render create user modal", () => {
    beforeAll(() => {
        setModalTarget('create-user');
        setModalOpen();
    });

    test("case-2-1 check title has been rendered", () => {
        render(CreateUserModal);
        const header = screen.queryByText("계정 생성");
        expect(header).not.toBeNull();
    });

    test("case-2-2 check label has been rendered", () => {
        render(CreateUserModal);
        const label = screen.queryByText("이름");
        expect(label).not.toBeNull();
    });

    test("case-2-3 check button has been rendered", () => {
        render(CreateUserModal);
        const button = screen.getByText("생성");
        expect(button).not.toBeNull();
    });

    afterAll(() => {
        setModalClose();
    })

    afterEach(() => {
        cleanup()
    })
});

describe("case-3 render Header before create user", () => {
    test("case-3-1 click create user button", async () => {
        const { getByText, component } = render(Header);
        const handleClick = jest.fn(() => console.log('bbb'));
        const createButton = getByText("계정 생성");
        createButton.click = handleClick;
        console.log(createButton.click());
        await fireEvent.click(createButton);
        // expect(handleClick).toBeCalledTimes(1);
    })
})