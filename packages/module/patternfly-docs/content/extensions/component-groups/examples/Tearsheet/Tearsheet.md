---
section: extensions
subsection: component-groups
id: Tearsheet
source: react
propComponents: ['Tearsheet', 'TearsheetHeader', 'TearsheetBody', 'TearsheetFooter', 'TearsheetGroup']
sourceLink: https://github.com/patternfly/react-component-groups/blob/main/packages/module/patternfly-docs/content/extensions/component-groups/examples/Tearsheet/Tearsheet.md
---

import { Fragment, useState } from 'react';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import TearsheetGroup from '@patternfly/react-component-groups/dist/dynamic/TearsheetGroup';
import Tearsheet, { createStackEscapeHandler } from '@patternfly/react-component-groups/dist/dynamic/Tearsheet';
import TearsheetHeader from '@patternfly/react-component-groups/dist/dynamic/TearsheetHeader';
import TearsheetBody from '@patternfly/react-component-groups/dist/dynamic/TearsheetBody';
import TearsheetFooter from '@patternfly/react-component-groups/dist/dynamic/TearsheetFooter';

**Tearsheet** is an extension of the [modal component](/components/modal), allowing more complex experiences to be provided to the user. Additionally, while the biggest `<Modal>` size (`ModalVariant.large`) may work for some cases, tearsheet allows more of the viewport area to be utilized.

## Examples

### Basic

Basic tearsheets should make use of the entire container. For this basic example, heading and body text is rendered with an action list placed within the footer area.

```ts file="./TearsheetBasic.tsx"
```

### Tearsheet layouts

Tearsheets can be customized to render various layout styles. These layout styles include, [full width text](/foundations-and-styles/utility-classes/alignment), [flex](/foundations-and-styles/layouts/flex), and [grid](/foundations-and-styles/layouts/grid).

The `<TearsheetBody>` component will handle scrolling for long content.

```ts file="./TearsheetLayouts.tsx"
```

### Stacked

Tearsheets support stacking, allowing new sheets to open on top of active ones. They utilize three visible stack levels (0, 1, and 2) and a background level (-1) to hide inactive sheets.

Limit stacked tearsheets to a maximum of 3. Flows requiring 4 or more levels should be redesigned using multi-step wizard or dedicates page to prevent loss of user context.

Wrap stacked tearsheets in `TearsheetGroup` to manage their stack levels, focus trapping, and Escape handling automatically. Child order determines stacking priority, from back to front. Escape calls only the last open sheet's `onEscapePress` callback, or its `onClose` callback when `onEscapePress` is not provided. Earlier sheets do not handle that event, even when the top sheet's callback keeps it open or the top sheet has no callback.

Providing `onEscapePress` replaces the underlying PatternFly Modal's `onClose` handling for Escape. The Escape callback is responsible for closing the overlay by updating its open state, such as setting `isOpen` to `false`; `onClose` is not also called. This applies to standalone tearsheets, sheets in `TearsheetGroup`, and callbacks supplied to `createStackEscapeHandler`. A callback that does not update the open state leaves the overlay open when Escape is pressed.

For standalone tearsheets or stacks that also include modals, use `createStackEscapeHandler` to coordinate Escape handling explicitly. During render, provide entries containing each overlay's current `isOpen` state and `onEscapePress` callback, ordered from back to front. Pass the returned handler to every participating overlay's `onEscapePress` prop. Only the last open entry handles Escape, even when its callback keeps the overlay open.

Both `TearsheetGroup` and the explicit handler call `stopImmediatePropagation()` to prevent participating overlays from handling the same Escape event more than once. This also blocks any document-level `keydown` listener registered after the earliest participating modal's listener, including listeners for popovers, tooltips, and third-party Escape handling.

An overlay outside this stack is not considered when choosing which entry handles Escape. If a non-participating overlay, such as a separate Modal, appears above the stack, Escape can dismiss the topmost participating tearsheet and swallow the event before the visually topmost overlay receives it. The outcome depends on listener registration (mount) order. Include overlays that need coordinated Escape handling in the same handler's entries and pass that handler to each overlay.

```ts file="./TearsheetStacked.tsx"
```

### Covering the masthead

By default, tearsheets reserve a `4rem` gap above the base sheet for the masthead and retain widths of `calc(100% - 4rem)`
at stack level 0, `calc(100% - 2rem)` at level 1, and `100%` at level 2. Set `coverMasthead` to extend the base
tearsheet over the masthead while keeping a top gap equal to its left and right gaps. These insets follow the PatternFly
page-chrome spacing token.

This example uses the same three layers as the stacked example above, with `coverMasthead` enabled on each sheet.
The vertical offsets between sheets are preserved so you can compare the additional vertical space at each level.

```ts file="./TearsheetCoverMasthead.tsx"
```

### Tearsheets vs Modals

Choose a tearsheet over a modal when users need to process detailed and complex workflows. This example demonstrates how the expanded surface area of a tearsheet allows users to easily navigate a robust layout without feeling overwhelmed.

```ts file="./TearsheetComparison.tsx"
```
