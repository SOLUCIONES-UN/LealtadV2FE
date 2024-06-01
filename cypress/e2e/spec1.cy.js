describe('template spec', () => {
  it('passes', () => {
    cy.viewport(1200, 800);
    cy.visit('http://127.0.0.1:5501/pages/login.html')
    cy.get('#formLogin > :nth-child(1)').type('JEstivenA')
    cy.get('#login-password').type('admin')
    cy.get('#btnLoggin').click()




  
  })
})