// @ts-ignore
import React from 'react'
// @ts-ignore
import PropTypes from 'prop-types'
// @ts-ignore
import { FormattedMessage, injectIntl } from 'react-intl'
// @ts-ignore
import { withRouter } from 'react-router-dom'
// @ts-ignore
import { intlShape } from '@zap/i18n'
// @ts-ignore
import { Button } from 'components/UI'
// @ts-ignore
import { Form, PasswordInput } from 'components/Form'
import WalletHeader from './WalletHeader'
import messages from './messages'

class WalletUnlocker extends React.Component {
  static displayName = 'WalletUnlocker'

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    intl: intlShape.isRequired,
    isLightningGrpcActive: PropTypes.bool.isRequired,
    isUnlockingWallet: PropTypes.bool,
    setUnlockWalletError: PropTypes.func.isRequired,
    staticContext: PropTypes.object,
    unlockWallet: PropTypes.func.isRequired,
    unlockWalletError: PropTypes.string,
    wallet: PropTypes.object.isRequired,
  }

  // @ts-ignore
  componentDidUpdate(prevProps) {
    const {
      wallet,
      isLightningGrpcActive,
      history,
      setUnlockWalletError,
      unlockWalletError,
    // @ts-ignore
    } = this.props

    // Set the form error if we got an error unlocking.
    if (unlockWalletError && !prevProps.unlockWalletError) {
      this.formApi.setError('password', unlockWalletError)
      setUnlockWalletError(null)
    }

    // If an active wallet connection has been established, switch to the app.
    if (isLightningGrpcActive && !prevProps.isLightningGrpcActive) {
      if (wallet.type === 'local') {
        history.push('/syncing')
      } else {
        history.push('/app')
      }
    }
  }

  // @ts-ignore
  setFormApi = formApi => {
    this.formApi = formApi
  }

  // @ts-ignore
  onSubmit = values => {
    // @ts-ignore
    const { unlockWallet } = this.props
    unlockWallet(values.password)
  }

  render = () => {
    const {
      intl,
      isLightningGrpcActive,
      isUnlockingWallet,
      setUnlockWalletError,
      unlockWallet,
      unlockWalletError,
      wallet,
      staticContext,
      ...rest
    // @ts-ignore
    } = this.props
    return (
      <Form
        key={`wallet-unlocker-form-${wallet.id}`}
        getApi={this.setFormApi}
        onSubmit={this.onSubmit}
        {...rest}
      >
        {({ 
// @ts-ignore
        formState }) => (
          <>
            <WalletHeader wallet={wallet} />

            <PasswordInput
              autoComplete="current-password"
              field="password"
              isRequired
              label={<FormattedMessage {...messages.wallet_unlocker_password_label} />}
              minLength={8}
              my={3}
              placeholder={intl.formatMessage({ ...messages.wallet_unlocker_password_placeholder })}
              validateOnBlur
              validateOnChange={formState.invalid}
              willAutoFocus
            />

            <Button isDisabled={isUnlockingWallet} isProcessing={isUnlockingWallet} type="submit">
              <FormattedMessage {...messages.wallet_unlocker_button_label} />
            </Button>
          </>
        )}
      </Form>
    )
  }
}

export default withRouter(injectIntl(WalletUnlocker))
