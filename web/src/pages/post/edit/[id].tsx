import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrlClient } from '../../../utils/createUrqlClient';
import { useGetIntId } from '../../../utils/useGetIntId';

export const EditPost = ({}) => {
    const router = useRouter();
    const intId = useGetIntId();
    const [{data, fetching}] = usePostQuery(
        {
            pause: intId === -1,
            variables:{
                id: intId
            }
        });
    const [,updatePost] = useUpdatePostMutation();

    if(fetching){
        <Layout>Loading...</Layout>
    }

    if(!data?.post){
        return <Layout>
            Could not find post.
        </Layout>
    }


    return (
        <Layout variant="small">
            <Formik
        initialValues={{ title: data.post.title, text: data.post.text}}
        onSubmit={async (values,) => {            
            await updatePost({id: intId, ...values})
            // router.push('/');
            router.back();
        }}
        >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
                
              />
            </Box>
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal">
                Update Post
              </Button>              
          </Form>
        )}
      </Formik>    
        </Layout>
        );
}

export default withUrqlClient(createUrlClient)(EditPost);