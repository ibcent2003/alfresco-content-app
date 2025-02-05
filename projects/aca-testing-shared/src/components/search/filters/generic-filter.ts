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

import { ElementFinder, by, browser, element } from 'protractor';
import { isPresentAndDisplayed, Utils, waitUntilElementIsVisible, waitUntilElementIsNotVisible, TestElement } from '../../../utilities';

async function waitUntilActionMenuIsVisible(): Promise<void> {
  const actionMenu = element.all(by.css('div[role="menu"]')).first();
  await waitUntilElementIsVisible(actionMenu);
}

async function waitUntilActionMenuIsNotVisible(): Promise<void> {
  const actionMenu = element.all(by.css('div[role="menu"]')).first();
  await waitUntilElementIsNotVisible(actionMenu);
}

export class GenericFilter {
  private readonly filterName: string;

  constructor(filterName: string) {
    this.filterName = filterName;
  }

  private readonly selectors = {
    root: 'adf-search-filter-chips',

    chip: '.mat-chip',
    chipDialog: '.mat-menu-content .adf-search-filter-menu-card'
  };

  get chip(): ElementFinder {
    return browser.element(by.cssContainingText(this.selectors.chip, this.filterName));
  }
  get filterDialogOpened(): ElementFinder {
    return browser.element(by.cssContainingText(this.selectors.chipDialog, this.filterName));
  }

  async getChipTitle(): Promise<string> {
    return browser.element(by.cssContainingText(`${this.selectors.root} ${this.selectors.chip}`, this.filterName)).getAttribute('title');
  }

  async clickApplyButton(): Promise<void> {
    await TestElement.byId('apply-filter-button').click();
  }

  async clickResetButton(): Promise<void> {
    await TestElement.byId('cancel-filter-button').click();
  }

  async isDisplayed(): Promise<boolean> {
    return isPresentAndDisplayed(this.chip);
  }

  async isDialogPresent(): Promise<boolean> {
    return isPresentAndDisplayed(this.filterDialogOpened);
  }

  async openDialog(): Promise<void> {
    if (!(await this.isDialogPresent())) {
      await this.chip.click();
      await waitUntilActionMenuIsVisible();
    }
  }

  async closeDialog(): Promise<void> {
    if (await this.isDialogPresent()) {
      await Utils.pressEscape();
      await waitUntilActionMenuIsNotVisible();
    }
  }
}
