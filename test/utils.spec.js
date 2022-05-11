import utils from '@/plugins/utils'
describe('utils', () => {
  test('is a telephone', () => {
    expect(utils.isMobilePhone('15501527670')).toBeTruthy()
  })
})
