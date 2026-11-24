import { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tearsheet from '../Tearsheet';
import TearsheetGroup from './TearsheetGroup';

describe('TearsheetGroup Escape handling', () => {
  it('should close only the topmost open sheet per Escape, including hidden stack levels', () => {
    const onClose = jest.fn();
    const Stack = () => {
      const [ openCount, setOpenCount ] = useState(4);
      return (
        <TearsheetGroup>
          {Array.from({ length: 5 }, (_, index) => (
            <Tearsheet
              key={index}
              isOpen={index < openCount}
              aria-label={`Sheet ${index}`}
              onClose={(event) => {
                onClose(index, event);
                setOpenCount((count) => count - 1);
              }}
            >
              Sheet content
            </Tearsheet>
          ))}
        </TearsheetGroup>
      );
    };
    render(<Stack />);

    fireEvent.keyDown(document.body, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();

    for (let index = 3; index >= 0; index--) {
      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(4 - index);
      expect(onClose).toHaveBeenLastCalledWith(index, expect.objectContaining({ key: 'Escape' }));
    }

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(4);
  });

  it('should prefer onEscapePress over onClose and protect earlier sheets when the callback keeps it open', () => {
    const closeBase = jest.fn();
    const closeTop = jest.fn();
    const escapeTop = jest.fn();
    render(
      <TearsheetGroup>
        <Tearsheet isOpen aria-label="Base" onClose={closeBase}>Base content</Tearsheet>
        <Tearsheet isOpen aria-label="Top" onClose={closeTop} onEscapePress={escapeTop}>Top content</Tearsheet>
      </TearsheetGroup>
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(escapeTop).toHaveBeenCalledTimes(1);
    expect(escapeTop).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }));
    expect(closeTop).not.toHaveBeenCalled();
    expect(closeBase).not.toHaveBeenCalled();
  });

  it('should protect earlier sheets when the topmost sheet has no Escape or close callback', () => {
    const closeBase = jest.fn();
    render(
      <TearsheetGroup>
        <Tearsheet isOpen aria-label="Base" onClose={closeBase}>Base content</Tearsheet>
        <Tearsheet isOpen aria-label="Top"><button type="button">Top action</button></Tearsheet>
      </TearsheetGroup>
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(closeBase).not.toHaveBeenCalled();
  });

  it('should use current callbacks and child order even when listener mount order differs', () => {
    const closeBase = jest.fn();
    const closeTop = jest.fn();
    const updatedCloseTop = jest.fn();
    const renderStack = (showBase: boolean, onClose: typeof closeTop) => (
      <TearsheetGroup>
        {showBase && <Tearsheet key="base" isOpen aria-label="Base" onClose={closeBase}>Base content</Tearsheet>}
        <Tearsheet key="top" isOpen aria-label="Top" onClose={onClose}>Top content</Tearsheet>
      </TearsheetGroup>
    );
    const { rerender } = render(renderStack(false, closeTop));

    // The base sheet mounts later, but child order still puts it behind the top sheet.
    rerender(renderStack(true, updatedCloseTop));
    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(updatedCloseTop).toHaveBeenCalledTimes(1);
    expect(closeTop).not.toHaveBeenCalled();
    expect(closeBase).not.toHaveBeenCalled();
  });
});
