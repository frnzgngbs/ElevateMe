const radioButton1 = document.getElementById('radio2')
const radioButton2 = document.getElementById('radio3')
const div1 = document.getElementById('venn2')
const div2 = document.getElementById('venn3')
function showVenn(){
    if(radioButton1.checked){
        div1.style.display = 'block'
        div2.style.display = 'none'
    }else if(radioButton2.checked){
        div1.style.display = 'none'
        div2.style.display = 'block'
    }
}

radioButton1.addEventListener('click', showVenn)
radioButton2.addEventListener('click', showVenn)

showVenn();