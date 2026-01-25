import React, { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react'

const RoleBasedProtectedRoute = ({children,allowedRole=[]}) => {
      const { isOpen, onOpen, onClose } = useDisclosure()
   
    const {accessToken,userRole} = useAuthStore()

    useEffect(()=>{
        if(!accessToken){
            onOpen()
        }
        else if(accessToken && !allowedRole.includes(userRole)){
            onOpen()
        }
    })

    const handleClose = ()=>{
        onClose()
        if(!accessToken){

            window.location.href='/login'
        }
        else {
            window.location.href='/unauthorized'
        }
    }
  if (accessToken && allowedRole.includes(userRole)) return children

  else   {
    return(

    <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="gray.800" color="gray.300">
            <ModalHeader>Access Denied</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{!accessToken ?(<Text> You must be logged in to access this page</Text>):<Text> You donot have permission to view this page</Text> } </ModalBody>

            <ModalFooter>
              {!accessToken ? (
              <Button colorScheme="blue" mr={3} onClick={handleClose}>
                Go to Login
              </Button>

              ):(
                     <Button colorScheme="blue" mr={3} onClick={handleClose}>
                Learn More
              </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
    )
    
  }
}

export default RoleBasedProtectedRoute
