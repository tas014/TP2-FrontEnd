const $lista = document.querySelector('.content');
const $campos=document.querySelectorAll('form div input');
const $form=document.querySelector('#formDiv');

const dataRow = properties => {
    const {_id,lat,long,quality,convenience} = properties;
    return `
        <div class='adminItem'>
            <h3>${lat} ; ${long}</h3>
            <div>
                <button data-id='${_id}' class='ignore edit'>Editar</button>
                <button data-id='${_id}' class='ignore delete'>Eliminar</button>
            </div>
        </div>
    `
}

const getLocations = async (id='') => {
    const result = await api.getLocations();
    if (id==''){
        $lista.innerHTML=null;
        result.forEach(element => {
            $lista.innerHTML+=dataRow(element)
        });
    } else {
        console.log(id);
        const element=result.find(el=> id==el._id);
        console.log(element);
        return element;
    }
}

const deleteLocation = async id => {
    const result = await api.deleteLocations(id);
    console.log('Deleted '+id);
}

const completeForm = reg => {
    const {lat,long,quality,convenience,_id} = reg;
    $campos[0].value=lat;
    $campos[1].value=long;
    $campos[2].value=quality;
    $campos[3].value=convenience;
    $campos[4].value=_id;
}

const blankForm = () => {
    $campos[0].value=null;
    $campos[1].value=null;
    $campos[2].value=null;
    $campos[3].value=null;
    $campos[4].value=null;
}

const updateContent = (type) => {
    const formData={
        "lat":$campos[0].value,
        "long":$campos[1].value,
        "quality":$campos[2].value,
        "convenience":$campos[3].value
    }
    if (type) {
        const id=$campos[4].value;
        api.editLocations(formData,id);
    } else {
        api.createLocations(formData);
    }
}

const hide =()=>{
    document.querySelector('.shadow').setAttribute('class','hidden');
}

document.addEventListener('click',async ()=>{
    //EDIT
    if(event.target.matches('.edit')) {
        const id=event.target.dataset.id;
        const reg= await getLocations(id);
        console.log(reg);
        completeForm(reg);
        $form.setAttribute('class','shadow');
        document.querySelector('form>input').value='Editar';
    }
    if(event.target.matches('form > input')) {
        if (document.querySelector('form > input').value=='Editar'){
            updateContent(true);
            hide();
            getLocations();
        } else {
            updateContent(false);
            hide();
            getLocations();
        }
    }
    if(event.target.matches('.shadow')){
        if(event.target.matches('form')){} else{
            hide();
        }
    }
    //DELETE
    if(event.target.matches('.delete')) {
        const id=event.target.dataset.id;
        deleteLocation(id);
        getLocations();
    }
    //ADD
    if(event.target.matches('#new')){
        blankForm();
        $form.setAttribute('class','shadow');
        document.querySelector('form>input').value='Crear';
    }
});

getLocations();