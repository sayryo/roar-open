package com.example.roar.entity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

//エンティティ(クラス名)と主キー(ID)の型を指定
//「JpaRepository」にはCRUD操作の為の基本的なメソッドが定義されている
public interface UsersTeamsRepository extends JpaRepository<UsersTeams, Long> {

    // UIDの完全一致
    List<UsersTeams> findByUidIs(String uid);

    // uidとteamIdの一致で削除
    void deleteByUidAndTeamId(String uid, String teamId);

}