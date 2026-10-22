/* Shared by the three review apps: reading applications from the ODP API, approving them, and
   falling back to sample data when there is no API. Nothing here is specific to one app's look. */
const Lab = (() => {
  const query = new URLSearchParams(location.search)
  let mode = null

  const el = (tag, attrs = {}, ...kids) => {
    const node = document.createElement(tag)
    for (const [key, value] of Object.entries(attrs || {})) {
      if (key === 'class') node.className = value
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value)
      else if (value === true) node.setAttribute(key, '')
      else if (value !== false && value != null) node.setAttribute(key, value)
    }
    for (const kid of kids.flat())
      node.append(
        kid instanceof Node ? kid : document.createTextNode(kid ?? '')
      )
    return node
  }
  const store = {
    get: (k, d) => {
      try {
        return localStorage.getItem(k) || d
      } catch {
        return d
      }
    },
    set: (k, v) => {
      try {
        localStorage.setItem(k, v)
      } catch {
        /* private window */
      }
    }
  }
  const editor = () => store.get('lab.name', 'reviewer')
  const council = () =>
    query.get('council') || store.get('lab.council', 'camden')
  const setCouncil = (name) => {
    store.set('lab.council', name)
    location.search =
      '?council=' +
      encodeURIComponent(name) +
      (query.has('demo') ? '&demo' : '')
  }
  const buzz = (ms = 12) => {
    try {
      navigator.vibrate?.(ms)
    } catch {
      /* not supported */
    }
  }
  let toastTimer
  const toast = (message) => {
    let box = document.getElementById('toast')
    if (!box) {
      box = el('div', { id: 'toast', role: 'status', hidden: true })
      document.body.append(box)
    }
    box.textContent = message
    box.hidden = false
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      box.hidden = true
    }, 2400)
  }

  // ------------------------------------------------------------ reading: the ODP unredacted endpoint
  async function odp(path) {
    const response = await fetch(path, {
      headers: { 'x-client': council(), 'x-service': 'lab' }
    })
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  }

  const normalise = (record) => {
    const sub = record.submission?.data || {}
    const pipe = record.metadata?.pipeline || {}
    const app = record.data?.application || {}
    const assess = record.data?.assessment || {}
    const site = sub.property?.boundary?.site
    return {
      reference: app.reference,
      council: pipe.council || council(),
      address: sub.property?.address?.singleLine || 'No address recorded',
      description: sub.proposal?.description || 'No description recorded',
      applicant: sub.applicant?.name
        ? `${sub.applicant.name.first} ${sub.applicant.name.last}`.trim()
        : '',
      type: record.applicationType,
      stage: app.stage,
      status: app.status,
      decision:
        assess.committeeDecision || assess.planningOfficerDecision || '',
      officer: record.data?.caseOfficer?.name || '',
      geometry: site?.geometry || null,
      area: sub.property?.boundary?.area?.squareMetres,
      flagged: !!pipe.flagged,
      issues: pipe.issues || [],
      approved: !!pipe.approved,
      record
    }
  }

  /** Applications still waiting for approval, from the API or, with no API, the sample data. */
  async function load() {
    if (!query.has('demo')) {
      try {
        const body = await odp(
          '/api/@next/applications?resultsPerPage=100&sortBy=publishedAt&orderBy=asc'
        )
        if (body.data.length) {
          mode = 'live'
          return body.data.map(normalise).filter((c) => !c.approved)
        }
      } catch {
        /* fall through to the sample data */
      }
    }
    mode = 'demo'
    return Demo.cards(council())
  }

  // ------------------------------------------------------------ writing: the admin's data routes
  async function decide(card, undo) {
    if (mode !== 'live') return
    const response = await fetch('/admin/data/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Edited-By': editor() },
      body: JSON.stringify({
        council: card.council,
        references: [card.reference],
        undo
      })
    })
    if (!response.ok) throw new Error(response.statusText)
  }
  const approve = (card) => decide(card, false)
  const unapprove = (card) => decide(card, true)

  /** True if the OpenAPI spec accepts this record, false if not, null if it cannot say. */
  async function specCheck(card) {
    if (mode !== 'live') return null
    try {
      const body = await (
        await fetch(
          `/admin/data/${card.council}/${encodeURIComponent(
            card.reference
          )}/check`
        )
      ).json()
      return body.valid
    } catch {
      return null
    }
  }

  // ------------------------------------------------------------ the record, told as a comment thread
  function thread(card) {
    const rows = [
      ['applicant', card.applicant || 'Not recorded'],
      ['address', card.address],
      ['proposal', card.description],
      ['type', card.type],
      ['stage', [card.stage, card.status].filter(Boolean).join(', ')],
      ['decision', card.decision || 'Not decided'],
      ['case_officer', card.officer || 'Not recorded']
    ]
    if (card.geometry)
      rows.push([
        'site',
        `GeoJSON ${card.geometry.type}${
          card.area ? `, ${card.area} square metres` : ''
        }`
      ])
    for (const issue of card.issues)
      rows.push(['mapper', `${issue.field}: ${issue.reason}`])
    return rows
  }
  const rawJson = (card) => JSON.stringify(card.record, null, 2)

  // ------------------------------------------------------------ a drawn site plan, from the GeoJSON
  const hash = (text) =>
    [...text].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7)
  function plan(card, { paper, ink, site, road, line }) {
    const seed = hash(card.reference || 'x')
    const rand = (i) => (((seed >>> i % 24) * 2654435761) % 1000) / 1000
    const ring = card.geometry?.coordinates?.[0] || []
    let poly = ''
    if (ring.length) {
      const flat = Math.cos((ring[0][1] * Math.PI) / 180) // a degree of longitude is shorter than one of latitude
      const xs = ring.map((p) => p[0] * flat),
        ys = ring.map((p) => p[1])
      const [x0, x1, y0, y1] = [
        Math.min(...xs),
        Math.max(...xs),
        Math.min(...ys),
        Math.max(...ys)
      ]
      const scale = 120 / Math.max(x1 - x0, y1 - y0 || 1e-9)
      poly = ring
        .map(
          ([x, y]) =>
            `${200 + (x * flat - (x0 + x1) / 2) * scale},${
              200 - (y - (y0 + y1) / 2) * scale
            }`
        )
        .join(' ')
    }
    const blocks = Array.from({ length: 14 }, (_, i) => {
      const a = rand(i * 3) * 6.28,
        d = 90 + rand(i * 5) * 110
      const w = 26 + rand(i * 7) * 40,
        h = 22 + rand(i * 11) * 36
      return `<rect x="${200 + Math.cos(a) * d - w / 2}" y="${
        200 + Math.sin(a) * d - h / 2
      }" width="${w}" height="${h}" rx="2" fill="${ink}" opacity=".16"/>`
    }).join('')
    const bend = 140 + rand(2) * 120
    return `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Site plan for ${
      card.reference
    }">
      <rect width="400" height="400" fill="${paper}"/>
      <g stroke="${line}" stroke-width=".6">${Array.from(
      { length: 20 },
      (_, i) => `<path d="M${i * 20} 0V400M0 ${i * 20}H400"/>`
    ).join('')}</g>
      <path d="M-10 ${bend} C120 ${bend - 40} 280 ${bend + 50} 410 ${
      bend - 10
    }" stroke="${road}" stroke-width="26" fill="none" opacity=".55"/>
      <path d="M${bend} -10 C${bend + 30} 140 ${bend - 40} 260 ${
      bend + 10
    } 410" stroke="${road}" stroke-width="16" fill="none" opacity=".4"/>
      ${blocks}
      ${
        poly
          ? `<polygon points="${poly}" fill="${site}" fill-opacity=".85" stroke="${site}" stroke-width="3"/><polygon points="${poly}" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="4 3"/>`
          : ''
      }
    </svg>`
  }

  return {
    el,
    query,
    store,
    editor,
    council,
    setCouncil,
    buzz,
    toast,
    load,
    approve,
    unapprove,
    specCheck,
    thread,
    rawJson,
    plan,
    get mode() {
      return mode
    }
  }
})()

/* ------------------------------------------------------------------------------------------------
   Sample data, shaped like the API's answer, so the apps can be shown without it running.
------------------------------------------------------------------------------------------------ */
const Demo = (() => {
  const T = {
    hh: 'pp.full.householder',
    full: 'pp.full.minor',
    ldc: 'ldc.proposed',
    listed: 'listed',
    adv: 'advertConsent',
    tree: 'wtt.notice'
  }
  // council, reference, type, address, description, decision, flagged, latitude, longitude
  const ROWS = [
    [
      'camden',
      '2024-1180-P',
      T.hh,
      '14 Ferdinand Street, London NW1 8EU',
      'Erection of a single storey rear extension and replacement of the rear dormer window',
      'granted',
      false,
      51.5453,
      -0.1505
    ],
    [
      'camden',
      '2024-0912-P',
      T.full,
      'Flat 3, 88 Highgate Road, London NW5 1PB',
      'Change of use of the ground floor from retail (Class E) to a dental surgery with minor shopfront changes',
      'granted',
      false,
      51.5526,
      -0.1453
    ],
    [
      'camden',
      '2024-1544-L',
      T.listed,
      'St Pancras Old Church, Pancras Road, London NW1 1UL',
      'Repair of the north vestry roof and reinstatement of the lead flashing',
      'granted',
      true,
      51.5362,
      -0.1272
    ],
    [
      'camden',
      '2023-4410-P',
      T.hh,
      '7 Gordon Mansions, Torrington Place, London WC1E 7HF',
      'Installation of a mansard roof extension to create an additional bedroom',
      'refused',
      false,
      51.5226,
      -0.1318
    ],
    [
      'camden',
      '2024-0233-A',
      T.adv,
      '214 Kentish Town Road, London NW5 2AD',
      'Display of one internally illuminated fascia sign and one projecting sign',
      'granted',
      true,
      51.5502,
      -0.1409
    ],
    [
      'camden',
      '2024-1691-T',
      T.tree,
      'Primrose Hill Gardens, Elsworthy Road, London NW3 3BT',
      'Fell one sycamore and crown reduce one lime by 20 percent',
      '',
      false,
      51.5412,
      -0.1659
    ],
    [
      'camden',
      '2024-1377-P',
      T.ldc,
      '3 Mackeson Road, London NW3 2LU',
      'Certificate of lawfulness for a proposed outbuilding in the rear garden',
      'granted',
      false,
      51.5516,
      -0.1513
    ],
    [
      'barnet',
      '24-0001-FUL',
      T.full,
      '12 High Road, London N12 8AB',
      'Demolition of the existing garage and construction of a two storey side dwelling',
      'granted',
      false,
      51.6097,
      -0.1766
    ],
    [
      'barnet',
      '24-0117-HSE',
      T.hh,
      '41 Totteridge Lane, London N20 8NT',
      'Single storey rear extension, loft conversion with rear dormer',
      'granted',
      false,
      51.6334,
      -0.1816
    ],
    [
      'barnet',
      '24-0342-FUL',
      T.full,
      'Unit 4, Finchley Industrial Estate, London N3 2QP',
      'Change of use from B8 storage to a gym with associated parking changes',
      'refused',
      true,
      51.6028,
      -0.1925
    ],
    [
      'barnet',
      '24-0455-HSE',
      T.hh,
      '9 Hampstead Way, London NW11 7JN',
      'Two storey side and rear extension, new front porch',
      'granted',
      false,
      51.5791,
      -0.1941
    ],
    [
      'barnet',
      '24-0560-ADV',
      T.adv,
      'Brent Cross Retail Park, Tilling Road, London NW2 1LP',
      'Installation of two free standing totem signs',
      '',
      true,
      51.5766,
      -0.2236
    ]
  ]
  const day = (offset) => new Date(Date.UTC(2024, 1, 18 + offset)).toISOString()

  // The same square the pipeline draws around a point (geo.py), so the sample looks like the real thing.
  function square(lat, lng, side = 10) {
    const dLat = side / 2 / 111320,
      dLng = side / 2 / (111320 * Math.cos((lat * Math.PI) / 180))
    const [w, e, s, n] = [lng - dLng, lng + dLng, lat - dLat, lat + dLat]
    return {
      site: {
        type: 'Feature',
        properties: null,
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [w, s],
              [e, s],
              [e, n],
              [w, n],
              [w, s]
            ]
          ]
        }
      },
      area: { squareMetres: side * side, hectares: (side * side) / 10000 }
    }
  }

  function record([
    council,
    reference,
    type,
    address,
    description,
    decision,
    flagged,
    lat,
    lng
  ]) {
    const decided = !!decision
    const issues = [
      {
        field: 'submission',
        reason:
          'no original submission for a historic record, only the applicant, address and description'
      },
      {
        field: 'boundary',
        reason:
          'source has a point only, so the site is a 10m square around it, not the real boundary'
      }
    ]
    if (decided)
      issues.push({
        field: 'expiryDate',
        reason:
          'estimated from the submission date and application type, not in the source'
      })
    if (flagged)
      issues.push({
        field: 'application_type',
        reason: 'put on the nearest type by fallback, not an agreed equivalent'
      })
    return {
      applicationType: type,
      data: {
        application: {
          reference,
          stage: decided ? 'assessment' : 'validation',
          status: decided ? 'determined' : 'undetermined',
          publishedAt: day(2)
        },
        localPlanningAuthority: { publicCommentsAcceptedUntilDecision: false },
        submission: { submittedAt: day(0) },
        validation: { receivedAt: day(0), validatedAt: day(1), isValid: true },
        caseOfficer: { name: council === 'camden' ? 'A. Okafor' : 'A. Patel' },
        ...(decided
          ? {
              assessment: {
                expiryDate: '2024-04-14',
                planningOfficerDecision: decision,
                planningOfficerDecisionDate: '2024-03-21'
              }
            }
          : {})
      },
      submission: {
        applicationType: type,
        data: {
          applicant: { name: { first: 'Sam', last: 'Rivera' } },
          property: {
            address: {
              singleLine: address,
              title: address,
              latitude: lat,
              longitude: lng
            },
            boundary: square(lat, lng)
          },
          proposal: { description }
        }
      },
      metadata: {
        organisation: council === 'camden' ? 'CMDN' : 'BNT',
        id: reference,
        submittedAt: day(0),
        generatedAt: day(30),
        schema:
          'https://theopensystemslab.github.io/digital-planning-data-schemas/@next/schemas/postSubmissionPublishedApplication.json',
        pipeline: {
          council,
          approved: false,
          edited: false,
          flagged,
          issues,
          sourceStatus: decided ? 'Decided' : 'Registered'
        }
      }
    }
  }

  const cards = (council) =>
    ROWS.filter(
      (r) => r[0] === council || !['camden', 'barnet'].includes(council)
    ).map((r) => {
      // Normalised the same way as a live record, by going through the page's own normaliser.
      const rec = record(r)
      const sub = rec.submission.data,
        pipe = rec.metadata.pipeline
      return {
        reference: r[1],
        council: r[0],
        address: sub.property.address.singleLine,
        description: sub.proposal.description,
        applicant: 'Sam Rivera',
        type: r[2],
        stage: rec.data.application.stage,
        status: rec.data.application.status,
        decision: r[5],
        officer: rec.data.caseOfficer.name,
        geometry: sub.property.boundary.site.geometry,
        area: sub.property.boundary.area.squareMetres,
        flagged: pipe.flagged,
        issues: pipe.issues,
        approved: false,
        record: rec
      }
    })
  return { cards }
})()
