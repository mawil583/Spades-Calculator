import { rotateDealerOrder, rotateDealer } from '../helpers/math/spadesMath';
import { expect } from 'chai';

test('rotateDealerOrder returns a new array with the order rotated', () => {
  const initialOrder = ['p1', 'p2', 'p3', 'p4'];
  const rotatedOnce = rotateDealerOrder(initialOrder);
  expect(rotatedOnce).deep.equals(['p2', 'p3', 'p4', 'p1']);

  const rotatedTwice = rotateDealerOrder(rotatedOnce);
  expect(rotatedTwice).deep.equals(['p3', 'p4', 'p1', 'p2']);

  // Check if the original array is not mutated
  expect(initialOrder).deep.equals(['p1', 'p2', 'p3', 'p4']);
});

test('rotateDealerOrder handles empty array', () => {
  const emptyOrder = [];
  const rotatedEmpty = rotateDealerOrder(emptyOrder);
  expect(rotatedEmpty).deep.equals([]);
});

test('rotateDealerOrder handles single element array', () => {
  const singleElementOrder = ['p1'];
  const rotatedSingle = rotateDealerOrder(singleElementOrder);
  expect(rotatedSingle).deep.equals(['p1']);
});

// Add a test for the original rotateDealer (which is now a placeholder)
test('rotateDealer returns roundHistory unchanged (placeholder)', () => {
  const mockRoundHistory = [{}, {}];
  const result = rotateDealer(mockRoundHistory);
  expect(result).deep.equals(mockRoundHistory);
});
