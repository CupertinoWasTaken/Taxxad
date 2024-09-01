enum State {
    AC = 'Acre',
    AL = 'Alagoas',
    AP = 'Amapá',
    AM = 'Amazonas',
    BA = 'Bahia',
    CE = 'Ceará',
    DF = 'Distrito Federal',
    ES = 'Espírito Santo',
    GO = 'Goiás',
    MA = 'Maranhão',
    MT = 'Mato Grosso',
    MS = 'Mato Grosso do Sul',
    MG = 'Minas Gerais',
    PA = 'Pará',
    PB = 'Paraíba',
    PR = 'Paraná',
    PE = 'Pernambuco',
    PI = 'Piauí',
    RJ = 'Rio de Janeiro',
    RN = 'Rio Grande do Norte',
    RS = 'Rio Grande do Sul',
    RO = 'Rondônia',
    RR = 'Roraima',
    SC = 'Santa Catarina',
    SP = 'São Paulo',
    SE = 'Sergipe',
    TO = 'Tocantins'
}

type ICMSTable = Record<keyof typeof State, number>

const ICMS: ICMSTable = {
    AC: 19,
    AL: 19,
    AP: 18,
    AM: 20,
    BA: 20.5,
    CE: 20,
    DF: 20,
    ES: 17,
    GO: 19,
    MA: 22,
    MT: 17,
    MS: 17,
    MG: 18,
    PA: 19,
    PB: 20,
    PR: 19.5,
    PE: 20.5,
    PI: 21,
    RJ: 22,
    RN: 18,
    RS: 17,
    RO: 19.5,
    RR: 20,
    SC: 17,
    SP: 18,
    SE: 19,
    TO: 20
}

let stacked = false
let stateName: keyof typeof ICMS | undefined = undefined

const IPI = 15
const ICMSTax = () => ICMS[stateName || "DF"]
const PISCOFINS = {
    stacked: [.65, 3],
    normal: [1.65, 7.6]
}


document.getElementById('cumulattive')!.addEventListener('click', function () {
    this.classList.toggle('active')
    document.getElementById('cummulated')!.classList.toggle('active')

    if (this.classList.contains('active')) {
        stacked = true
        document.getElementById('PIS')!.innerText = '0,65'
        document.getElementById('COFINS')!.innerText = '3'
        updateTaxes()
        return
    }

    stacked = false
    document.getElementById('PIS')!.innerText = '1,65'
    document.getElementById('COFINS')!.innerText = '7,6'
    updateTaxes()
})

const dropdown = document.getElementById('dropdown')! as HTMLDivElement
const stateButton = document.getElementById('state')! as HTMLButtonElement

for (const state in ICMS) {
    const button = document.createElement('button')
    button.innerHTML = `<img src="/assets/flags/${state}.svg" /> ${State[state]} <span class="tax">${state}</span>`

    button.addEventListener('click', () => {
        if (!dropdown.classList.contains('active')) return
        stateButton.classList.add('active')

        document.querySelector('#state .lucide')?.remove()
        document.querySelector('#state span')!.innerHTML = State[state]

        document.getElementById('icms')!.innerText = ICMS[state]

        const image = document.querySelector('#state img')! as HTMLImageElement
        image.src = `/assets/flags/${state}.svg`
        image.style.display = 'block'

        stateName = state as keyof typeof ICMS
        updateTaxes()
    })

    dropdown.appendChild(button)
}

stateButton.addEventListener('click', function (e) {
    e.stopPropagation()
    dropdown.classList.toggle('active')
})

const priceElem = document.getElementById('price')! as HTMLInputElement

const formatPrice = (price: number) => parseFloat(price.toFixed(2))

function updateTaxes() {
    const price = parseFloat(priceElem.value) || 0
    const ipi = IPI / 100 * price
    const icms = ICMSTax() / 100 * price

    const pisValue = PISCOFINS[stacked ? 'stacked' : 'normal'][0] / 100
    let pis = pisValue * price

    const cofinsValue = PISCOFINS[stacked ? 'stacked' : 'normal'][1] / 100
    const cofins = cofinsValue * price

    let total = price + ipi + icms + pis + cofins
    const oldTotal = total

    if (stacked) {
        total += total * cofinsValue
        total += total * pisValue

        pis += total - oldTotal
    }

    console.log(total * 100, price)
    document.getElementById('value-ipi')!.innerText = `${formatPrice(ipi)}`
    document.getElementById('value-icms')!.innerText = `${formatPrice(icms)}`
    document.getElementById('value-pis-cofins')!.innerText = `${formatPrice(pis + cofins)}`
    document.getElementById('value-total')!.innerText = `${formatPrice(total)}`
}

priceElem.addEventListener('input', updateTaxes)
updateTaxes()

document.onclick = () => dropdown.classList.remove('active')