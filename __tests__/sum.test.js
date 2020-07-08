function sum(a, b) {
  return a + b;
}

// eslint-disable-next-line no-undef
it('adds 1 + 2 to equal 3', () => {
  // eslint-disable-next-line no-undef
  expect(sum(1, 2)).toBe(3);
});
