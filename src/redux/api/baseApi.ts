import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const libraryApi = createApi({
    reducerPath: 'libraryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://a3-library-management-api-three.vercel.app/' }),
    tagTypes:["BookData", "BorrowSummary", "SingleBookData"],
    endpoints: (builder) =>({
        getAllBook: builder.query({
            query: () => '/api/books',
            providesTags: ["BookData"]
        },),
        getBookById: builder.query({
            query: (id) => `/api/books/${id}`,
            providesTags: ["SingleBookData"]
        }),
        createABook: builder.mutation({
            query: (newBook) => ({
                url: '/api/books',
                method: 'POST',
                body: newBook,
            }),
            invalidatesTags: ["BookData"],
        }),
        editABook: builder.mutation({
            query: (bookData) => ({
                url: `/api/books/${bookData?._id}`,
                method: 'PUT',
                body: bookData,
            }),
            invalidatesTags: ["BookData"],
        }),
        deleteABook: builder.mutation({
            query: (id) =>({
                url: `/api/books/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["BookData"],
        }),
        getBorrowSummary: builder.query({
            query: () => '/api/borrow',
            providesTags: ["BorrowSummary"]
        }),
        borrowABook: builder.mutation({
            query: (data) => ({
                url: '/api/borrow',
                method: 'POST',
                body: data,
            }),
            invalidatesTags:["BorrowSummary", "BookData", "SingleBookData"],
        })
    }),
});

export const { useGetAllBookQuery, useCreateABookMutation, useDeleteABookMutation,useEditABookMutation, useGetBookByIdQuery, useGetBorrowSummaryQuery, useBorrowABookMutation } = libraryApi;