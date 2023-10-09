import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ItemDetails } from './ItemDetails'
import { AuthContext } from '../common/context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { CartContext } from '../common/context/CartContext'

const mockItem = {
    _id: 1,
    category: 1,
    title: 'title1',
    rating: 2,
    price: 1,
    images: []
}

const mockCategory = {
    _id: 1,
    title: 'cat1'
}

const mockUser = {
    _id: 1,
    roles: ['user']
}

const mockAdmin = {
    _id: 2,
    roles: ['admin']
}

const mockRating = {
    rating: 2,
    user: 1,
    item: 1
}


const host = 'http://localhost:3030'
const server = setupServer(
    rest.get(host + `/item/rating`, (req, res, ctx) => {
        return res(ctx.json([mockRating]))
    }),
    rest.get(host + '/item/:id', (req, res, ctx) => {
        return res(ctx.json(mockItem))
    }),
    rest.get(host + '/category/:id', (req, res, ctx) => {
        return res(ctx.json(mockCategory))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads item info for guest', async () => {
    renderSkeleton({}) // guest

    const title = await screen.findByText(mockItem.title)

    expect(title).toBeInTheDocument()
})

test('loads item info for user', async () => {
    renderSkeleton(mockUser)

    const ratingStars = await screen.findAllByText('★')

    expect(ratingStars.length).toBe(mockItem.rating)
})

test('doesn\'t show rating for admin', async () => {
    renderSkeleton(mockAdmin)

    await screen.findByText(mockItem.title)

    expect(screen.queryByText(t => t.includes('Rate:'))).not.toBeInTheDocument()
})

test('shows edit/delete buttons for admin', async () => {
    renderSkeleton(mockAdmin)

    await screen.findByText('Edit')
    await screen.findByText('Delete')
})

test('does\'t show edit/delete buttons for user', async () => {
    renderSkeleton(mockUser)

    await screen.findByText(mockItem.title)

    expect(screen.queryByText(t => t.includes('Edit'))).not.toBeInTheDocument()
    expect(screen.queryByText(t => t.includes('Delete'))).not.toBeInTheDocument()
})

test('does\'t show edit/delete buttons for guest', async () => {
    renderSkeleton({}) // guest

    await screen.findByText(mockItem.title)

    expect(screen.queryByText(t => t.includes('Edit'))).not.toBeInTheDocument()
    expect(screen.queryByText(t => t.includes('Delete'))).not.toBeInTheDocument()
})


function renderSkeleton(user) {
    render(
        <AuthContext.Provider value={{ user }}>
            <CartContext.Provider value={{ addToCart: () => { } }}>
                <BrowserRouter>
                    <ItemDetails />
                </BrowserRouter>
            </CartContext.Provider>
        </AuthContext.Provider>
    )
}