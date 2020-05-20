import React, { useEffect, useState } from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'
import axios from 'axios'
import { messages } from './cases.I18n'
import { Check } from 'react-bootstrap-icons';
import LocaleContext from '../../state/contexts/LocaleContext'
import { StyledTable } from '../../components/UI/Widgets/TableComponent'
import casesInstance from '../../Instances/axios-cases'
import WindowContainer from '../../components/UI/Widgets/WindowContainer'
import Spinner from '../../components/UI/Spinner/Spinner'
import UseTableSorter from '../UserTable/UseTableSorter'
import RadioButtons from './RadioButtons'
import Paginator from './Paginator'
import InfoBar from './InfoBar'


const Cases = () => {
  const locale = React.useContext(LocaleContext);
  const { lang, status, caption, totalSum, currency } = messages[locale]

  const [currencyRates, setCurrencyRates] = useState({GBP:0.078, NOK:1})
  const [selectedStatus, setSelectedStatus] = useState("0")
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  
  const casesFilteredByStatus = cases.filter(c => c.status === selectedStatus || selectedStatus === "0")
  const [t2ChangeSortField, t2GetSortFunc, t2IndicatorIcon] = UseTableSorter('up', 'debitorNavn', 'string')
  const [Paginate, PaginationNav, PaginationDropdown, PaginationIndex, resetPagination] = Paginator(casesFilteredByStatus.sort(t2GetSortFunc().fn))

  useEffect(() => {
    if(loading){
      casesInstance.get("")
        .then(res => res.data)
        .then(setCases)
        .then(setLoading)
      
      axios.get('https://api.exchangeratesapi.io/latest?base=NOK')
        .then(res => res.data.rates)
        .then(setCurrencyRates)
    } 
  }, [loading])

  const sum = cases.reduce((total, curr) => total + curr.saldo, 0)
  const formatDate = date => new Date(date).toLocaleDateString(lang)
  const formatDisbute = disbute => disbute !== "N" && <Check size={20} className="ml-1" />
  const formatCurrency = num => new Intl.NumberFormat(lang, { style: "currency", currency })
    .format((num * currencyRates[currency]).toFixed(2)) 
  
  const dummyCaseUrl = "http://kf-test-web1.kred.no/Infocenter/externallogin.aspx?q=d6346f71f31172a54b406a5acb408e1a680a3cb7608389f49dd5a2d3804f3f1d"
  const dummyClickHandler = () => window.open(dummyCaseUrl, '_blank')

  return (
    <>
      <InfoBar arr={status} cases={cases} />
      <WindowContainer caption={caption}>
        {loading ? <Spinner /> : 
        <IntlProvider locale={locale} messages={messages[locale]}>
          <TotalSaldo>{totalSum}: {formatCurrency(sum, lang)}</TotalSaldo>
          <PaginationDropdown />
          <RadioButtons 
            arr={status}
            checked={k => k == selectedStatus}
            onClick={(k) => {
              setSelectedStatus(k)
              resetPagination()
            }}
          />
          <StyledTable>
            <thead>
              <tr>
                <th onClick={() => t2ChangeSortField('detbitorNr', 'num')}><FormattedMessage id="detbitorNr" />{t2IndicatorIcon('detbitorNr')}</th>
                <th onClick={() => t2ChangeSortField('debitorNavn', 'string')}><FormattedMessage id="debitorNavn" />{t2IndicatorIcon('debitorNavn')}</th>
                <th onClick={() => t2ChangeSortField('fakturanr', 'num')}><FormattedMessage id="fakturanr" />{t2IndicatorIcon('fakturanr')}</th>
                <th onClick={() => t2ChangeSortField('forfall', 'datetime')}><FormattedMessage id="forfall" />{t2IndicatorIcon('forfall')}</th>
                <th onClick={() => t2ChangeSortField('belop', 'num')}><FormattedMessage id="belop" />{t2IndicatorIcon('belop')}</th>
                <th onClick={() => t2ChangeSortField('sistePurreDato', 'datetime')}><FormattedMessage id="sistePurreDato" />{t2IndicatorIcon('sistePurreDato')}</th>
                <th onClick={() => t2ChangeSortField('saldo', 'num')}><FormattedMessage id="saldo" />{t2IndicatorIcon('saldo')}</th>
                <th onClick={() => t2ChangeSortField('tvist', 'string')}><FormattedMessage id="tvist" />{t2IndicatorIcon('tvist')}</th>
              </tr>
            </thead>
            <tbody>
              <Paginate>
                {c =>  
                  <tr key={c.id}>
                    <td onClick={dummyClickHandler}>{c.detbitorNr}</td>
                    <td onClick={dummyClickHandler}>{c.debitorNavn}</td>
                    <td>{c.fakturanr}</td>
                    <td>{formatDate(c.forfall)}</td>
                    <td>{formatCurrency(c.belop, lang)}</td>
                    <td>{formatDate(c.sistePurreDato)}</td>
                    <td>{formatCurrency(c.saldo, lang)}</td>
                    <td>{formatDisbute(c.tvist)}</td>
                    <td>
                      <Button variant="success"><FormattedMessage id="inkasso" /></Button>
                    </td>
                    <td>
                      <Button variant="warning"><FormattedMessage id="resend" /></Button>{' '}
                      <Button variant="danger"><FormattedMessage id="avskriv" /></Button>
                    </td>
                  </tr>
                } 
              </Paginate>    
            </tbody>
          </StyledTable>
          <br />
          <PaginationIndex />
          <br /><br />
          <PaginationNav />
        </IntlProvider>}
      </WindowContainer>
    </>
  )
}

const TotalSaldo = styled.div`
  float: right;
  margin-right: 80px;
  margin-top: -47px;
  font-weight: bold;
  font-size: 18px;
`

export default Cases
