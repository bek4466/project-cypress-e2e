import selectors from '../selectors/shop.selectors.json';
import { BasePage } from './BasePage';

export class CatalogPage extends BasePage {
  filterBy(searchTerm: string, category: string): void {
    cy.get(selectors.catalog.search).clear().type(searchTerm);
    cy.get(selectors.catalog.category).select(category);
  }

  addProduct(productName: string): void {
    cy.get(selectors.catalog.productCards)
      .contains(productName)
      .parents(selectors.catalog.productCards)
      .find(selectors.catalog.addToCart)
      .click();
  }
}
