describe('Portfolio Web Application E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load initial Contact view and redirect from root', () => {
    cy.url().should('include', '/contact');
    cy.get('h1').should('contain', "Let's work together");
  });

  it('should navigate through React Router pages', () => {
    // Navigate to CV
    cy.get('#nav-cv').click();
    cy.url().should('include', '/cv');
    cy.contains('Christelle Mamekem Ngueguim');
    cy.contains('Languages & Spoken Proficiency');
    cy.contains('Hobbies & Personal Interests');

    // Navigate to Services
    cy.get('#nav-services').click();
    cy.url().should('include', '/services');
    cy.contains('Technical Services & Consulting');

    // Navigate to Projects
    cy.get('#nav-projects').click();
    cy.url().should('include', '/projects');
    cy.contains('PEPPOL E-Invoicing Engine');

    // Navigate to Blog
    cy.get('#nav-blog').click();
    cy.url().should('include', '/blog');
    cy.contains('Technical Insights & Articles');
  });

  it('should toggle language between English and French', () => {
    cy.get('#lang-toggle-btn').click();
    // In French, title changes
    cy.get('h1').should('contain', 'Travaillons ensemble');

    cy.get('#lang-toggle-btn').click();
    cy.get('h1').should('contain', "Let's work together");
  });

  it('should navigate to blog article detail page and back', () => {
    cy.get('#nav-blog').click();
    cy.get('#blog-card-zero-flicker-spas-hydration').click();
    cy.url().should('include', '/blog/zero-flicker-spas-hydration');
    cy.contains('Architecting Zero-Flicker SPAs');

    cy.get('#back-to-blog-btn').click();
    cy.url().should('include', '/blog');
  });

  it('should prefill contact form when clicking book service', () => {
    cy.get('#nav-services').click();
    cy.get('#book-service-srv-dotnet').click();
    cy.url().should('include', '/contact?subject=Service%20Inquiry');
    cy.get('#subject').invoke('val').should('match', /Service Inquiry: .NET/);
  });
});
