import { ValidatePhoneNumberPipe } from './validate-phone-number.pipe';

describe('PhoneNumberPipe', () => {
  it('should be defined', () => {
    expect(new ValidatePhoneNumberPipe()).toBeDefined();
  });
});
