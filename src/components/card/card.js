import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import config from '../../../config/config.json'
import { FlatList } from 'react-native-gesture-handler';

export default function Card({ usuario }) {
    const [isActive, setIsActive] = useState(false);
    const [carregando, setCarregando] = useState(true)
    const [data, setData] = useState([]);



    const usuarioId = usuario || ''

    useEffect(() => {
        fetchData();
    }, [usuarioId]);


    const fetchData = async () => {
        let response = await fetch(`${config.urlRoot}/categoria/listar`, {
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

        if (json === '') {
            setCarregando(false)
        } else {
            setData(json)
            setCarregando(false)
        }

    }


    const toggleCard = () => {
        setIsActive(!isActive);
    };

    return (

        <View>
            {
                carregando ? <Text>
                    Você ainda não possui nenhuma categoria!
                </Text> : (
                    <FlatList
                        data={data}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.card} onPress={toggleCard}>
                                <View style={styles.upContainer}>
                                    <Text style={styles.title}>{item.nome}</Text>
                                    <Text style={styles.value}>{item.valor}</Text>
                                </View>
                                {isActive && (
                                    <View style={styles.cardContent}>
                                        <Text style={styles.text}>
                                            {item.descricao}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                )
            }
        </View>


    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#d9d9d9',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        padding: 14,
        textAlign: 'center',
        width: 320,
        marginTop: 10,

    },
    upContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10
    },
    cardContent: {
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',

    },
    text: {
        fontSize: 16,
        textAlign: 'justify',
    },
});