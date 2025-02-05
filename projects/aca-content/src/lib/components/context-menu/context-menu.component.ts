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
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, ViewEncapsulation, OnInit, OnDestroy, HostListener, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentActionRef, ExtensionsModule } from '@alfresco/adf-extensions';
import { ContextMenuOverlayRef } from './context-menu-overlay';
import { CONTEXT_MENU_DIRECTION } from './direction.token';
import { Direction } from '@angular/cdk/bidi';
import { AppExtensionService } from '@alfresco/aca-shared';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { IconModule } from '@alfresco/adf-core';
import { ContextMenuItemComponent } from './context-menu-item.component';
import { OutsideEventDirective } from './context-menu-outside-event.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatDividerModule,
    IconModule,
    ContextMenuItemComponent,
    ExtensionsModule,
    OutsideEventDirective
  ],
  selector: 'aca-context-menu',
  templateUrl: './context-menu.component.html',
  host: {
    class: 'aca-context-menu-holder'
  },
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  actions: Array<ContentActionRef> = [];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  @HostListener('document:keydown.Escape', ['$event'])
  handleKeydownEscape(event: KeyboardEvent) {
    if (event) {
      if (this.contextMenuOverlayRef) {
        this.contextMenuOverlayRef.close();
      }
    }
  }

  constructor(
    private contextMenuOverlayRef: ContextMenuOverlayRef,
    private extensions: AppExtensionService,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Direction
  ) {}

  onClickOutsideEvent() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  runAction(contentActionRef: ContentActionRef) {
    this.extensions.runActionById(contentActionRef.actions.click, {
      focusedElementOnCloseSelector: '.adf-context-menu-source'
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.extensions
      .getAllowedContextMenuActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => (this.actions = actions));
  }

  ngAfterViewInit() {
    setTimeout(() => this.trigger.openMenu(), 0);
  }

  trackByActionId(_: number, obj: ContentActionRef): string {
    return obj.id;
  }
}
