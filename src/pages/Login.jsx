import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useLogin } from "../services/auth";
import { useAuthStore } from "../store/authStore";
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";

const Login = () => {
  const { setTokens } = useAuthStore();
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      const { accessToken, refreshToken } = response.data.data;
      const userRole = response.data.data.user.role;

      setTokens({
        accessToken,
        refreshToken,
        userRole,
      });

      toast({
        title: "Login Successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/product");
    } catch (error) {
      console.error("Login failed: ", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      console.log('google logged in user', result.user)
      const { accessToken, refreshToken } = result.user.stsTokenManager
      setTokens({
        accessToken,
        refreshToken,
        userRole: "USER"
      })
      navigate('/product')
    }
    catch (error) {
      console.error(error)
    }
  }
  const signInWithGithub = async ()=>{
    const provider = new GithubAuthProvider()
    try{
      const result = await signInWithPopup(auth,provider)
      console.log('User logged in with Github',result)
      const {accessToken,refreshToken}=result.token.stsTokenManager
      setTokens({
        accessToken,refreshToken,userRole:'USER'
      }
   )
    } catch(error){
      console.error(error)
    }
  }
  const signInWithFacebook= async ()=>{
    const provider = new FacebookAuthProvider()
    try{

      const result = await signInWithPopup(auth,provider)
      const {accessToken,refreshToken}= result.token.stsTokenManager
      setTokens({
        accessToken,refreshToken
      })
    }catch(error){
      console.error(error)

    }
  }
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
      <Heading size={"lg"} mb={6} textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              borderColor={"gray.300"}
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              borderColor={"gray.300"}
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="cyan"
            width={"full"}
            type="submit"
            color={"black"}
            isLoading={isSubmitting}
          >
            Login
          </Button>

          <Button
            variant={"outline"}
            colorScheme="cyan"
            width={"full"}
            onClick={() => navigate("/register")}
          >
            Create an account
          </Button>
          <Button
            width='full'

            onClick={() => signInWithGoogle()}
          >
            <Text marginEnd={'5'}>
              Signin With Google
            </Text>
            <FcGoogle size={'24'} />
          </Button>
          <Button
            width='full'

            onClick={() => signInWithGithub()}
          >
            <Text marginEnd={'5'}>
              Signin With Github
            </Text>
            <FaGithub  size={'24'} />
          </Button>
          <Button
            width='full'

            onClick={() => signInWithFacebook()}
          >
            <Text marginEnd={'5'}>
              Signin With Facebook
            </Text>
            <FaFacebook color="blue"  size={'24'} />
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;