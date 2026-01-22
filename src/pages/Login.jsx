import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, Toast, VStack } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { useLogin } from '../services/auth'
import { useAuthStore } from '../store/authStore'



const Login = () => {
    const {setTokens}= useAuthStore()
   const {mutateAsync:loginUser}= useLogin()
    const navigate = useNavigate()

    const {register,handleSubmit,formState:{errors,isSubmitting},}= useForm({defaultValues: {
        email:"",password:""
    }})

const onSubmit = async (data) => {
  try {
    const response = await loginUser(data);

    const { accessToken, refreshToken, user } = response.data.data;

    setTokens({
      accessToken,
      refreshToken,
      userRole: user?.role,
    });

    navigate("/product");
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
  }
};

    return (
        <Box
            w={{ base: "90%", md: "400px" }}
            mt={10}
            p={8}
            borderRadius="lg"
            boxShadow="5px 10px 50px 2px #0003"
            color="white"
            border={"1px"}
            borderColor={"gray.800"}
        >
            <Heading size={'lg'} mb={6} textAlign={'center'}>
                Login
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
                <FormControl isInvalid={errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input borderColor={'gray.400'}
                        type='email'
                        placeholder='Enter Email'
                        {...register('email',{
                                required:"Email is required",

                            })
                        }
                         />
                         <FormErrorMessage>
                            {errors?.email?.message}
                         </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input borderColor={'gray.400'}
                        type='password'
                        placeholder='Enter Password'
                            {...register('password',{
                                required:"Password is required",

                            })
                        } />
                        <FormErrorMessage>
                            {errors?.password?.message}
                         </FormErrorMessage>
                </FormControl>
                <Button
                    type='submit' color={'black'} colorScheme='cyan' w={'full'}>
                    Login                </Button>
                <Button
                onClick={()=>navigate('/register')}
                    variant={'outline'} colorScheme='cyan' w={'full'}>
                    Create an Account
                </Button>
            </VStack>

            </form>

        </Box>
    )
}

export default Login
