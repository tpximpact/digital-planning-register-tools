import React from 'react'
import type { Client } from '@dpr/libs'

interface ClientsTableProps {
  clients: Client[]
}

export const ClientsTable: React.FC<ClientsTableProps> = async ({
  clients
}) => (
  <table border={1} cellPadding={10} cellSpacing={0}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Endpoint</th>
        <th>Last Polled At</th>
        <th>Updated At</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      {clients.map((client) => (
        <tr key={client.id}>
          <td>{client.id}</td>
          <td>{client.name}</td>
          <td>{client.endpoint}</td>
          <td>
            {client.lastPolledAt
              ? new Date(client.lastPolledAt).toLocaleString()
              : '-'}
          </td>
          <td>
            {client.updatedAt
              ? new Date(client.updatedAt).toLocaleString()
              : '-'}
          </td>
          <td>
            {client.createdAt
              ? new Date(client.createdAt).toLocaleString()
              : '-'}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
