describe('Catalog browsing', () => {
  it('displays landing page hero text', () => {
    cy.visit('/')
    cy.contains('季節を纏うネイルチップ').should('be.visible')
  })
})
