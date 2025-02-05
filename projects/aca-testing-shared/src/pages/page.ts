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

import { browser, by, ElementFinder, WebElement } from 'protractor';
import { APP_ROUTES, USE_HASH_STRATEGY } from '../configs';
import { Utils, waitElement, waitForPresence, isPresentAndDisplayed, waitUntilElementIsPresent, waitUntilElementIsVisible } from '../utilities';
import { Header } from '../components';
import { UploadFilesDialog } from '../components/dialog/upload-files-dialog';

export abstract class Page {
  appRoot = 'app-root';

  layout = this.byCss('app-shell');
  overlay = this.byCss('.cdk-overlay-container');
  snackBar = this.byCss(`[data-automation-id='adf-snackbar-message-content-action-button']`);
  dialogContainer = this.byCss('.mat-dialog-container');

  uploadFilesDialog = new UploadFilesDialog();

  constructor(public url: string = '') {}

  protected byCss(css: string): ElementFinder {
    return browser.element(by.css(css));
  }

  async load(relativeUrl: string = '') {
    const hash = USE_HASH_STRATEGY ? '#' : '';
    const path = `${browser.baseUrl}${hash}${this.url}${relativeUrl}`;
    return browser.get(path);
  }

  async waitForApp(): Promise<void> {
    await waitForPresence(this.layout);
  }

  async signOut(): Promise<void> {
    const header = new Header();
    await header.openMoreMenu();
    await header.menu.clickMenuItem('Sign out');
    await waitUntilElementIsPresent(browser.element(by.css('[class*="login-content"] input#username')));
  }

  async waitForDialog(): Promise<void> {
    await waitUntilElementIsVisible(this.dialogContainer);
  }

  async isDialogOpen(): Promise<boolean> {
    return isPresentAndDisplayed(this.dialogContainer);
  }

  async closeOpenDialogs(): Promise<void> {
    while (await this.isDialogOpen()) {
      await Utils.pressEscape();
    }
  }

  async refresh(): Promise<void> {
    await browser.refresh();
    await this.waitForApp();
  }

  async getSnackBarMessage(): Promise<string> {
    const elem = await waitElement(`[data-automation-id='adf-snackbar-message-content']`);
    const attributeValue: string = await browser.executeScript(`return arguments[0].innerText`, elem);
    return attributeValue || '';
  }

  async getSnackBarAction(): Promise<string> {
    let elem: WebElement;
    try {
      elem = await waitElement(`[data-automation-id='adf-snackbar-message-content-action-button']`);
    } catch (e) {
      return '';
    }
    const attributeValue: string = await browser.executeScript(`return arguments[0].innerText`, elem);
    return attributeValue || '';
  }

  async clickSnackBarAction(): Promise<void> {
    try {
      const action = await waitElement(`[data-automation-id='adf-snackbar-message-content-action-button']`);
      await action.click();
    } catch (e) {
      console.error(e, '.......failed on click snack bar action.........');
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const url = await browser.driver.getCurrentUrl();
    return !url.includes(APP_ROUTES.LOGIN);
  }
}
