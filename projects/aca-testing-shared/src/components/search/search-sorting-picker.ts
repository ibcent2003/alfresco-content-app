/*!
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { by, browser } from 'protractor';
import { Component } from '../component';
import { isPresentAndDisplayed, waitUntilElementIsVisible, click } from '../../utilities';

export type SortByType = 'Relevance' | 'Title' | 'Filename' | 'Modified date' | 'Modifier' | 'Created date' | 'Size' | 'Type';
export class SearchSortingPicker extends Component {
  actionMenu = browser.element(by.css('aca-search-action-menu > button'));
  sortOrderButton = browser.element(by.css('#aca-button-sorting-menu'));
  sortByDropdownExpanded = browser.element.all(by.css('.mat-menu-panel')).get(1);
  sortByList = this.sortByDropdownExpanded.all(by.css('button'));

  constructor(ancestor?: string) {
    super('aca-button-action-menu', ancestor);
  }

  async waitForSortByDropdownToExpand(): Promise<void> {
    await waitUntilElementIsVisible(this.sortByDropdownExpanded);
  }

  async isSortOrderButtonDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.actionMenu);
  }
  async isSortByDropdownExpanded(): Promise<boolean> {
    return isPresentAndDisplayed(this.sortByDropdownExpanded);
  }

  async clickSortByDropdown(): Promise<void> {
    await click(this.actionMenu);
    await click(this.sortOrderButton);
    await this.waitForSortByDropdownToExpand();
  }

  async getSortByOptionsList(): Promise<string[]> {
    return this.sortByList.map(async (option) => {
      return option.getText();
    });
  }

  async sortBy(option: SortByType, direction: string): Promise<void> {
    if (!(await this.isSortByDropdownExpanded())) {
      await this.clickSortByDropdown();
    }
    const elem = browser.element(by.cssContainingText('.mat-menu-item', option));
    const optionId = await elem.getAttribute('id');
    await click(elem);
    const directionSortElement = browser.element(by.id(`${optionId}-${direction.toLocaleLowerCase()}`));
    await click(directionSortElement);
  }
}
