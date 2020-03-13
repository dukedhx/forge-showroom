import React, { useContext, useState } from 'react'
import { ErrorBoundary } from '../error-boundary'
import { Header, Footer } from 'components/layout'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import LayoutContext from '../contexts/layout'
import NotificationContext from '../contexts/notification'
import Modal from '@material-ui/core/Modal'
import { Alert, AlertTitle } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

type Message = {
  message: string
  title?: string
}

const useStyles = makeStyles(theme => ({
  container: {
    'min-height': 'calc(100vh - 145px)',
    width: '95%',
    padding: '20px 20px 0 5%'
  },
  modal: {
    position: 'absolute',
    boxShadow: theme.shadows[5],
    width: '50%',
    top: '20%',
    left: '25%'
  },
  bgCanvas: {
    position: 'fixed',
    'z-index': '-233',
    width: '100%',
    height: '100vh',
    '$ > div': { height: '100vh' }
  }
}))

export const Layout = props => {
  const [isAlert, setIsAlert] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ message: '', title: '' })
  const showMessage = (message, isalert) => {
    setOpenModal(true)
    setIsAlert(isalert)
    setAlertMessage(message)
    return true
  }

  const notificationHandlers = {
    alert: (alert: Message) => showMessage(alert, true),
    notify: (alert: Message) => showMessage(alert, false),
    dialogue: (alert: Message) => showMessage(alert, false)
  }

  const classes = useStyles()
  const layoutContext = useContext(LayoutContext)

  return (
    <>
      <div className={classes.bgCanvas} id="bgContainerSB233">
        <div id="bgContainerSB233Output"></div>
      </div>
      <CssBaseline />
      <NotificationContext.Provider value={notificationHandlers}>
        <Header />
        <ErrorBoundary>
          <main>
            <Container
              maxWidth={layoutContext.layout.maxWidth}
              className={classes.container}
              style={{ background: layoutContext.layout.background }}
            >
              {props.children}
            </Container>
          </main>
        </ErrorBoundary>
        <Footer />
      </NotificationContext.Provider>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Alert
          severity={isAlert ? 'error' : 'info'}
          className={classes.modal}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setOpenModal(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>{alertMessage.title || 'Attention'}</AlertTitle>
          {alertMessage.message}
        </Alert>
      </Modal>
    </>
  )
}
