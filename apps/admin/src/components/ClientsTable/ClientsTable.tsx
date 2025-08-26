import React from 'react'
import type { Client } from '../../types/types'
import Link from 'next/link'

interface ClientsTableProps {
  clients: Client[]
}

export const ClientsTable: React.FC<ClientsTableProps> = async ({
  clients
}) => (
  <table className="govuk-table">
    <thead className="govuk-table__head">
      <tr className="govuk-table__row">
        <th scope="col" className="govuk-table__header">
          ID
        </th>
        <th scope="col" className="govuk-table__header">
          Name
        </th>
        <th scope="col" className="govuk-table__header">
          Endpoint
        </th>
        <th scope="col" className="govuk-table__header">
          Last Polled At
        </th>
        <th scope="col" className="govuk-table__header">
          Updated At
        </th>
        <th scope="col" className="govuk-table__header">
          Created At
        </th>
        <th scope="col" className="govuk-table__header">
          <span className="govuk-visually-hidden">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody className="govuk-table__body">
      {clients.map((client) => (
        <tr key={client.id} className="govuk-table__row">
          <td className="govuk-table__cell">{client.id}</td>
          <td className="govuk-table__cell">
            <Link className="govuk-link" href={`/clients/${client.id}`}>
              {client.name}
            </Link>
          </td>
          <td className="govuk-table__cell">{client.endpoint}</td>
          <td className="govuk-table__cell">
            {client.lastPolledAt
              ? new Date(client.lastPolledAt).toLocaleString()
              : '—'}
          </td>
          <td className="govuk-table__cell">
            {client.updatedAt
              ? new Date(client.updatedAt).toLocaleString()
              : '—'}
          </td>
          <td className="govuk-table__cell">
            {client.createdAt
              ? new Date(client.createdAt).toLocaleString()
              : '—'}
          </td>
          <td className="govuk-table__cell">
            <Link href={`/clients/${client.id}/edit`} className="govuk-link">
              Edit
              <span className="govuk-visually-hidden"> {client.name}</span>
            </Link>
          </td>
          <td className="govuk-table__cell">
            <Link href={`/clients/${client.id}/delete`} className="govuk-link">
              Delete
              <span className="govuk-visually-hidden"> {client.name}</span>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
