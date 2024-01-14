import constants from "./constants.js";

const newDate = (d) => {
    const [day, month, year] = d.split('/');
    return new Date(year, month, day);
}

const chomp = s => s.replace(/^ +/, '')
                    .replace(/ +$/, '')

const mapChomp = s => s.replace(/; $/, '').split(/;/).map(chomp)

const FIXUP = t => t.replace('murales o lugares', 'murales y lugares')                  //
.replace('símbolos y lugares', 'símbolos, murales y lugares')          //
.replace('amrnazas', 'amenazas')                                       //
.replace(/identidades política$/, 'identidades políticas')             //
.replace('antiLGBTINB+', 'antiLGBTINBQ+')                              //
.replace('supremaracismo', 'supremacismo')                             //
.replace(/^racismo y xenofob.a$/, 'racismo, xenofobia y nacionalismo') //
.replace(/^violencia física y atentados contra la vida$/,              //
'atentados contra la integridad física y la vida')                     //
.replace(/^violencia por razones de misoginia, antifeminismo y antiLGBTINB+$/, 'misoginia, antifeminismo y antiLGBTINBQ+')
class Classifier {
    byId = {};
    byName = {};
    idMap = {};
    nameMap = {};

    constructor(self, mangle = t => t) {
        this.mangle = mangle
    }

    clasify (ids, names, i) {
        for (let k in ids) {
            const id = this.mangle(ids[k])
            if (ids.length == 1) {
                const oldName = this.idMap?.[id]
                if (oldName && (oldName != names[k])) {
                    console.error(`${i}: error in idMap:
 ${id} was '${oldName}' now wants to be '${names[k]}'`)

                } else {
                    this.idMap = {...(this.idMap || {}), [id]: names[k]}
                }
            }

            this.byId[id] = [...(this.byId[id] || []), i]
        }

        for (let k in names) {
            const name = this.mangle(names[k])
            if (names.length == 1) {
                const oldId = this.nameMap?.[name]
                if (oldId && (oldId != ids[k])) {
                    console.error(`${i}: error in nameMap:
 ${name} was '${oldId}' now wants to be '${ids[k]}'`)
                } else {
                    this.nameMap = {...(this.nameMap || {}), [name]: ids[k]}
                }
            }

            this.byName[name] = [...(this.byName[name] || []), i]
        }
    }
}

export const fetchTSV = async (url = constants.tsvUrl) => {
    const resp = await fetch(url);
    const cases = []
    const tipos = new Classifier(FIXUP)
    const componentes = new Classifier(FIXUP)

    let min = new Date();
    let max = new Date();
    max.setDate(0);
    let i = 0;


    const [desc, ...rows] = (await resp.text()).split('\r\n').map(r => r.split('\t'));
    for (let r of rows) {
        i++;
        const f = {}
        for (let p in r) {
            f[desc[p].replace('caso.', '')] = r[p]
        }
        const [latitude, longitude] = f.coordenadas.split(",").map(parseFloat);
        const event = {
            id: parseInt(f.id),
            title: f.titulo,
            date: newDate(f.fecha),
            source: f.fuente,
            coords: {
                latitude,
                longitude,
            },
            provincia: f.provincia,
            tipoId: mapChomp(f['tipo.id']),
            tipo: mapChomp(f.tipo),
            componenteId: mapChomp(f['componente.id']),
            componente: mapChomp(f.componente)
        }
        cases.push(event)

        /* update min, max and do sanity checks */
        if (min > event.date) min = event.date
        if (max < event.date) max = event.date

        ;['tipo','tipoId', 'componente', 'componenteId', 'date'].forEach(f => {
            if (! event[f]) {
                console.error(`case missing ${f}`, event)
            }
            if (event[f].includes && event[f].includes("")) {
                console.error(`${i}: error in ${f}`, event[f], r)
            }
        })
        tipos.clasify(event.tipoId, event.tipo, i)
        componentes.clasify(event.componenteId, event.componente, i)
    }
    return {cases, tipos, componentes, min, max}
}

fetchTSV()
    .then(v => console.log(JSON.stringify(v, null, 4)))
