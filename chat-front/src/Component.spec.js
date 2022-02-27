import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import App from './pages';
import Header from './components/common/Header';
import Button from './components/common/Button';
import Dropdown from './components/common/Dropdown';
import Card from './components/common/Card';
import Content from '$components/home/Content'
import Chat from './pages/chat/[id]';
import CreateUserModal from './components/home/modals/CreateUserModal';
import { setModalClose, setModalOpen, setModalTarget } from './stores/modal';
import { createUserName, userStore } from './stores/user';
import axios from 'axios';
import { getRoomList } from '$stores/room';

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
});

describe("case-3 render Header", () => {
    beforeAll(() => {
        const response = { status: 201, data: { data: '' }};
        axios.post.mockResolvedValue(response);
    })

    test("case-3-1 click create user button", async () => {
        render(Header);
        screen.getByText("계정 생성");
        screen.getByText("생성된 유저 목록");
    })

    test("case-3-2 after user's created", async () => {
        render(Header);
        await createUserName('YHLEE');
        screen.getByText("방 생성");
        screen.getByText('YHLEE님');
        screen.getByText('참여한 방 목록');
    })

    afterAll(() => {
        userStore.set({
            username: '',
            userNameList: [],
        })
    })
})

describe("case-4 check button", () => {
    test("case-4-1 button rendered", () => {
        const { getByTestId } = render(Button);
        expect(getByTestId("button")).not.toBeNull();
    })

    test("case-4-2 button click", () => {
        const { component, getByTestId } = render(Button);
        const handleClick = jest.fn();
        component.$on('click', handleClick);
        fireEvent.click(getByTestId("button"))
        expect(handleClick).toBeCalledTimes(1)
    })
})

describe("case-5 dropdown render", () => {
    const listItemKey = {id: 'id', label: 'name'};
    const list = [
        {id: 1, name: 'test1'},
        {id: 2, name: 'test2'},
    ];

    test("case-5-1 dropdown open", async () => {
        const { getByTestId } = render(Dropdown);
        await fireEvent.click(getByTestId("dropdown"))
        const dropdownElement = getByTestId("dropdown-list");
        expect(dropdownElement).not.toBeNull();
        expect(dropdownElement.childElementCount).toEqual(0)
    })

    test("case-5-2 dropdown open with list ", async () => {
        const { getByTestId } = render(Dropdown, { listItemKey, list });
        await fireEvent.click(getByTestId("dropdown"))
        const dropdownElement = getByTestId("dropdown-list");
        expect(dropdownElement.childElementCount).toEqual(2)
    })

    test("case5-3 dropdown list item check", async () => {
        const { getByTestId } = render(Dropdown, { listItemKey, list });
        await fireEvent.click(getByTestId("dropdown"));
        const dropdownElement = getByTestId("dropdown-list");
        expect(dropdownElement).toHaveTextContent("test1");
        expect(dropdownElement).toHaveTextContent("test2");
    })

    test("case-5-4 dropdown with label", async () => {
        const { getByTestId } = render(Dropdown, { label: 'test', listItemKey, list });
        const dropdown = getByTestId("dropdown");
        expect(dropdown).toHaveTextContent("test");
        expect(dropdown.querySelector('ul')).toBeNull();
    })
})

describe("case-6 Card render", () => {
    test("case-6-1 card rendered", () => {
        const { getByText } = render(Card, { title: 'test' })
        getByText('test')
    })
});

describe("case-7 Content render", () => {
    const roomName = 'TEST_ROOM';
    const roomID = '1';
    const userName = 'YHLEE';

    beforeAll(() => {
        const response = { status: 201, data: { data: '' }};
        axios.post.mockResolvedValue(response);
    })

    test("case-7-1 before create user", async () => {
        render(Content);
        screen.getByText("계정을 생성해주세요");
    })

    test("case-3-2 after create user", async () => {
        render(Content);
        await createUserName('YHLEE');
        screen.getByText("참여 가능한 방 목록");
    })

    test("case-3-3 after create room", async () => {
        render(Content);
        const getResponse = { status: 200, data: { data: [
            { id: roomID, name: roomName, countParticipant: 0 },
        ] }};
        axios.get.mockResolvedValue(getResponse);
        await getRoomList()
        screen.getByText(roomName);
    })

})
