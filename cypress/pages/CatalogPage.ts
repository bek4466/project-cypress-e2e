import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class CatalogPage extends BasePage {
  filterBy(searchTerm: string, category: string): void {
    // Applies the shopper search and category filters before product selection.
    cy.get(selectors.catalog.search).clear().type(searchTerm);
    cy.get(selectors.catalog.category).select(category);
  }

  addProduct(productName: string): void {
    // Scopes the add-to-cart action to the card that contains the expected product name.
    cy.get(selectors.catalog.productCards)
      .contains(productName)
      .parents(selectors.catalog.productCards)
      .find(selectors.catalog.addToCart)
      .click();
  }
}
