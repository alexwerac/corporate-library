/* eslint-disable unicorn/filename-case */
/* eslint-disable no-undef */

import { booksApi } from "./booksApi";

const commentsApi = booksApi.injectEndpoints({
    endpoints: (build) => ({
        postComment: build.mutation({
            query: (body) => ({
                url: '/api/comments',
                method: 'POST',
                body: {
                    data: body.data,
                },
            }),
            invalidatesTags: ['Book'],
        }),
    }),
})

export const { usePostCommentMutation } = commentsApi;