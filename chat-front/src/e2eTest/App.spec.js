/// <reference types="cypress" />

const rnd = Math.ceil(Math.random() * 1000)
const HALF_SECOND = 500;
const USER_NAME = `YHLEE-${rnd}`;
const ROOM_NAME = `ROOM-${rnd}`;

describe("Create User & Room Test", () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001')
    })

    it('display Home page', () => {
        cy.get('[data-cy=createUserModalOpen]').should('be.visible');
        cy.get('[data-testid=dropdown]').should('be.visible');
    })


    it("create user & create room", () => {
        cy.get('[data-cy=createUserModalOpen]').click();
        cy.wait(HALF_SECOND * 3);
        cy.get('[data-cy=create-user]').find("input").type(USER_NAME).invoke('val').should('eq', USER_NAME);
        cy.get('[data-cy=createUserButton]').click();
        cy.wait(HALF_SECOND);
        cy.get('[data-cy=createRoomModalOpen]').click();
        cy.wait(HALF_SECOND * 3);
        cy.get('[data-cy=create-room]').find("input").type(ROOM_NAME).invoke('val').should('eq', ROOM_NAME);
        cy.wait(HALF_SECOND);
        cy.get('[data-cy=createRoomButton]').click();
        cy.wait(HALF_SECOND);
        cy.get('[data-cy=roomListRefresh]').click();
        cy.wait(HALF_SECOND);
        cy.get(`[data-cy=ROOM-${rnd}]`).should('be.visible');
    })


    after(() => {
        cy.request('DELETE', '/api/user', { name: `YHLEE-${rnd}`}).then((response) => {
            expect(response.body).to.have.property('msg', 'ok')
        });
    })
});

