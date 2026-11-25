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
import Tearsheet from '@patternfly/react-component-groups/dist/dynamic/Tearsheet';
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

Use `TearsheetGroup` to manage stack levels, focus trapping, and Escape handling. Open sheets stack in child order, from back to front. See [Escape handling](#escape-handling) for callback behavior and limitations.

Limit stacks to 3 visible tearsheets. For deeper flows, use a multi-step wizard or dedicated page.

```ts file="./TearsheetStacked.tsx"
```

### Covering the masthead

All tearsheets use the PatternFly page-chrome token for their side insets. Set `coverMasthead` to also use this token for the base sheet's top inset, extending it over the masthead. Stacked sheets retain their vertical offsets. When omitted or false, the top inset is 4rem.

```ts file="./TearsheetCoverMasthead.tsx"
```

### Tearsheets vs Modals

Choose a tearsheet over a modal when users need to process detailed and complex workflows. This example demonstrates how the expanded surface area of a tearsheet allows users to easily navigate a robust layout without feeling overwhelmed.

```ts file="./TearsheetComparison.tsx"
```

## Escape handling

In `TearsheetGroup`, Escape calls only the topmost open sheet's `onEscapePress`, falling back to `onClose`. A supplied `onEscapePress` must update the open state to close the sheet; `onClose` is not also called. Earlier sheets stay open even if the top sheet has no callback or stays open.

For standalone tearsheets or mixed Modal stacks, call `createStackEscapeHandler` during render with each overlay's current `isOpen` and `onEscapePress`, ordered back to front. Pass the returned handler to every overlay's `onEscapePress`; only the last open entry runs, and its callback controls dismissal.

Both approaches use `stopImmediatePropagation()`:

- Document-level `keydown` listeners registered after the earliest participating modal's listener are blocked, including popover, tooltip, and third-party Escape handlers.
- An overlay outside the stack may sit above it, yet Escape can dismiss the topmost participating sheet and be swallowed before reaching that overlay. Behavior depends on listener registration (mount) order; include overlays needing coordinated Escape handling in the shared handler.
