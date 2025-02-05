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

import { ElementFinder, by, browser } from 'protractor';
import { Menu } from '../menu/menu';
import { Component } from '../component';
import { click } from '../../utilities';

export class Sidenav extends Component {
  links = this.component.all(by.css('.item'));
  personalFiles = this.byCss(`[data-automation-id='app.navbar.personalFiles']`);
  fileLibraries = this.byCss(`[data-automation-id='app.navbar.libraries.menu']`);
  myLibraries = this.byCss(`[data-automation-id='app.navbar.libraries.files']`, browser);
  favoriteLibraries = this.byCss(`[data-automation-id='app.navbar.libraries.favorite']`, browser);
  shared = this.byCss(`[data-automation-id='app.navbar.shared']`);
  recentFiles = this.byCss(`[data-automation-id='app.navbar.recentFiles']`);
  favorites = this.byCss(`[data-automation-id='app.navbar.favorites']`);
  trash = this.byCss(`[data-automation-id='app.navbar.trashcan']`);

  menu: Menu = new Menu();

  constructor(ancestor?: string) {
    super('app-sidenav', ancestor);
  }

  async isActive(name: string): Promise<boolean> {
    const cssClass = await this.getLinkLabel(name).getAttribute('class');
    return cssClass.includes('action-button--active');
  }

  private getLinkLabel(name: string): ElementFinder {
    switch (name) {
      case 'Personal Files':
        return this.personalFiles;
      case 'File Libraries':
        return this.fileLibraries;
      case 'My Libraries':
        return this.myLibraries;
      case 'Favorite Libraries':
        return this.favoriteLibraries;
      case 'Shared':
        return this.shared;
      case 'Recent Files':
        return this.recentFiles;
      case 'Favorites':
        return this.favorites;
      case 'Trash':
        return this.trash;
      default:
        return this.personalFiles;
    }
  }

  async clickLink(name: string): Promise<void> {
    try {
      const link = this.getLinkLabel(name);
      await click(link);
    } catch (error) {
      console.error(`---- clickLink catch : sidebar navigation failed to click on - ${name} : `, error);
    }
  }
}
