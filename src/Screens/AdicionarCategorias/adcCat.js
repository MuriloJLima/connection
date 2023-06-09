import React, { useEffect, useState } from "react";

import adcCatStyle from "./adcCatStyle";

import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Alert

} from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import config from '../../../config/config.json'

export default function Categorias({ navigation }) {

    const [display, setDisplay] = useState([])
    const [usuarioId, setUsuarioId] = useState()
    const [data, setData] = useState([]);

    const [nome, setNome] = useState(null)
    const [descricao, setDescricao] = useState(null)
    const [valor, setValor] = useState(null)


    //função que requisita id do usuário
    useEffect(() => {
        getUsuarioId();
    }, []);

    async function getUsuarioId() {
        let response = await AsyncStorage.getItem('usuarioData')
        let json = JSON.parse(response)
        setUsuarioId(json.id)
    }


    useEffect(() => {
        fetchData();
    }, [usuarioId]);

    //função que requisita renda / orçamento do usuário
    const fetchData = async () => {
        let response = await fetch(`${config.urlRoot}/categoria/disponivelCat`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuarioId: usuarioId
            }),
        })
        let json = await response.json()
        setData(json)
    }


    // const dispinivel = Number(data).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })


    async function sendForm() {
        let response = await fetch(`${config.urlRoot}/categoria/adicionar`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                rendaDisponivel: data,
                usuarioId: usuarioId,
                nome: nome,
                descricao: descricao,
                valor: Number(valor)
            }),
        })
        let json = await response.json()
        if (json === 'success') {
            Alert.alert(
                '',
                'Categoria criada com sucesso!',
                [
                    {
                        text: 'OK',
                          onPress: () => navigation.navigate('Categorias'),
                    },
                ]
            );
            setNome('')
            setDescricao('')
            setValor('')
            fetchData()
        } else {
            setDisplay(json.erros)
            setTimeout(() => {
                setDisplay('')
            }, 5000)
        }

    }


    return (

        <View style={adcCatStyle.container}>
            <StatusBar backgroundColor={'#2C3C51'} barStyle="light-content" />

            <Image
                style={adcCatStyle.fundoImg}
                source={require('../../assets/fundo.png')}
            />
            <TouchableOpacity>
                <Image
                    style={adcCatStyle.menu}
                    source={require('../../assets/menu.png')}
                />
            </TouchableOpacity>

            <Text style={adcCatStyle.texto1}>E-PLANNER</Text>

            <View style={adcCatStyle.Valor}>
                <Text style={adcCatStyle.txtVal1}>Valor Disponível:</Text>
                <Text style={adcCatStyle.txtVal3}>{data}</Text>
            </View>

            <KeyboardAvoidingView
                style={adcCatStyle.inputContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Text style={adcCatStyle.inpTxt1}>Adicionar uma categoria</Text>

                <View>
                    <Text style={adcCatStyle.categoriaMsg}>
                        {display[0]}
                    </Text>
                </View>

                <TextInput
                    style={adcCatStyle.inp1}
                    placeholder="Nome da categoria"
                    keyboardType="default"
                    underlineColorAndroid="transparent"
                    value={nome}
                    onChangeText={text => setNome(text)} />

                <TextInput
                    style={adcCatStyle.inp2}
                    placeholder="Descrição (opcional)"
                    maxLength={100}
                    keyboardType="default"
                    underlineColorAndroid="transparent"
                    value={descricao}
                    onChangeText={text => setDescricao(text)} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={adcCatStyle.subContainerInput}>
                    <TextInput
                        style={adcCatStyle.inp3}
                        placeholder="Valor"
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        value={valor}
                        onChangeText={text => setValor(text)} />

                    <View style={adcCatStyle.btn}>
                        <Text style={adcCatStyle.btnText}>R$</Text>
                    </View>
                </KeyboardAvoidingView>

                <KeyboardAvoidingView
                    style={adcCatStyle.btnContainer}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <TouchableOpacity style={adcCatStyle.btnContinuar}
                        onPress={() => sendForm()}>
                        <Text style={adcCatStyle.btnConinuarTxt}>Continuar</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

            </KeyboardAvoidingView>
        </View>
    )
}