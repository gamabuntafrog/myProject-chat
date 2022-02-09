import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://6203b64e4d21c200170b9f93.mockapi.io' }),
    tagTypes: ['messages'],
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: () => ({ url: `/messages` }),
            providesTags: [`messages`]
        }),
        postMessage: builder.mutation({
            query: (message) => ({
                url: `/messages`,
                method: 'POST',
                body: message
            }),
            invalidatesTags: ['messages']
        }),
        deleteMessage: builder.mutation({
            query: (id) => ({
                url: `/messages/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['messages']
        })
    })
})