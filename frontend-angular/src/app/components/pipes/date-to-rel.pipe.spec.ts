import { RelativeDatePipe } from './date-to-rel.pipe';

describe('DateToRelPipe', () => {
  it('create an instance', () => {
    const pipe = new RelativeDatePipe();
    expect(pipe).toBeTruthy();
  });
});
