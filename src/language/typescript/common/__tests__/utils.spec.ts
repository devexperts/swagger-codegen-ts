import { getIOName, getTypeName } from '../utils';

describe('typescript/common/utils', () => {
	it('getTypeName', () => {
		expect(getTypeName('37sds afd,asd.324sfa as2_+=')).toBe('_37sds_afd_asd_324sfa_as2___');
	});
	it('getIOName', () => {
		expect(getIOName('37sds afd,asd.324sfa as2_+=')).toBe('_37sds_afd_asd_324sfa_as2___IO');
	});
});
